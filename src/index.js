import _ from 'lodash'
import { combineReducers } from 'redux'
import { connect } from 'react-redux'
import { put, fork, select, takeEvery, all } from 'redux-saga/effects'
import { generateActionCreator, generateSetActionCreator, updateInObject } from './utils'

const diffArr = (arr1, arr2) => {
  const diff = []
  const matched = []
  for (const item1 of arr1) {
    if (!arr2.includes(item1)) {
      diff.push(item1)
    } else {
      matched.push(arr2.indexOf(item1))
    }
  }
  if (matched.length !== arr2.length) {
    arr2.forEach((item, index) => {
      if (!matched.includes(index)) {
        diff.push(item)
      }
    })
  }
  return diff
}

export const feedStore = (store, models) => {
  models.forEach(model => {
    model.store = store
  })
}

export const extractReducer = models => {
  return combineReducers(models.reduce((obj, model) => {
    return {
      ...obj,
      [model.namespace]: model.reducer
    }
  }, {}))
}

export const extractSaga = models => {
  return function* () {
    yield all(models
      .map(model => model.saga)
      .filter(Boolean)
      .map(saga => fork(saga)))
  }
}

const formatType = type => _.upperCase(type).split(' ').join('_')

const RESERVED_TYPES = ['watch', 'set']

class Model {
  constructor({
    namespace,
    state,
    actionCreators,
    reducer,
    computations,
    saga,
    effects: effects0,
    watch
  } = {}) {
    const self = this
    this.namespace = namespace
    this.initialState = state

    const effects = {
      ...effects0,
      $watch: this._builtInEffects.watch
    }

    const computationsTypes = _.keys(computations)
    const effectTypes = _.keys(effects)
    const actionCreatorTypes = _.keys(actionCreators)
    const types = [...computationsTypes, ...effectTypes, ...actionCreatorTypes]

    this._validateTypes(types)

    this.actionTypes = [...computationsTypes, ...actionCreatorTypes].reduce((obj, type) => {
      return {
        ...obj,
        [formatType(type)]: this._prefixType(type)
      }
    }, {})
    this.actionTypes = {
      ...this.actionTypes,
      ...effectTypes.reduce((obj, type) => {
        // _.upperCase 会去除 $
        const namespacedType = this._prefixType(type)
        return {
          ...obj,
          [formatType(type)]: namespacedType,
          [formatType(type) + '_START']: namespacedType + '@START',
          [formatType(type) + '_END']: namespacedType + '@END',
        }
      }, {}),
      SET: this._prefixType('set')
    }

    // generate action creators
    const generatedActionCreators = types.reduce((creators, type) => {
      return {
        ...creators,
        [type]: this._generateActionCreator(type)
      }
    }, {})
    this.actionCreators = {
      ...generatedActionCreators,
      ...this._mapCreatorTypes(actionCreators),
      $set: generateSetActionCreator(this.namespace, state)
    }

    // generate reducer
    this.reducer = (state = this.initialState, action) => {
      // todo: compose
      const state0 = this._builtInReducer(state, action)
      const state1 = reducer
        ? reducer(state0, action)
        : state0
      const type = this._unprefixType(action.type)
      if (computations && computations[type]) {
        return computations[type](state1, action.payload, action.meta, action.error)
      }
      return state1
    }

    // saga
    if (saga || effects) {
      this.saga = function* () {
        yield all([
          ...saga ? [fork(saga.bind(self))] : [],
          ...effects
            ? _.map(effects, (generator, key) => {
              return fork(this._effectToSaga(key, generator))
            })
            : []
        ])
      }.bind(this)
    }

    this._watch = watch
  }

  _validateTypes(types) {
    types.forEach(type => {
      if (RESERVED_TYPES.includes(type)) {
        console.error(`${type} is a reserved name!`)
      }
      if (type.startsWith('$') && !RESERVED_TYPES.map(type => '$' + type).includes(type)) {
        console.error(`Computations, effects, actionCreators names cannot start with '$'! Found ${type}`)
      }
    })
    const set = Array.from(new Set(types))
    if (set.length !== types.length) {
      const diff = diffArr(set, types).join(' ')
      console.error(`You have duplicated names: ${diff}!`)
    }
  }

  _builtInReducer = (state, action) => {
    const { payload, type, meta } = action
    if (this.actionTypes.SET === type) {
      return updateInObject(state, meta, payload)
    }
    return state
  }

  _registerWatch() {
    if (this._watch) {
      _.forEach(this._watch, (handler, key) => {
        this.$watch(key, handler.bind(this))
      })
    }
  }

  _builtInEffects = {
    watch: function* (path, handler) {
      let lastState = {}
      yield takeEvery('*', function* handleTakeEvery() {
        const currState = yield select()
        const selfState = currState[this.namespace]
        const lastVal = _.get(lastState, path)
        const currVal = _.get(selfState, path)
        if (!_.isEqual(lastVal, currVal)) {
          handler({
            value: currVal,
            prevValue: lastVal,
            state: currState
          })
        }
        lastState = selfState
        yield
      }.bind(this))
    }
  }

  _effectToSaga(key, generator) {
    const self = this
    const type = this._prefixType(key)
    return function* () {
      yield takeEvery(type, function* (action) {
        yield put({ type: type + '@START' })
        yield generator.bind(self)(action.payload, action.meta, action.error)
        yield put({ type: type + '@END' })
      })
    }
  }

  _generateActionCreator = type => generateActionCreator(this._prefixType(type))

  _unprefixType = type => {
    const typePrefix = formatType(this.namespace) + '/'
    let output
    if (type.startsWith(typePrefix)) {
      output = type.substr(typePrefix.length)
    } else {
      output = type
    }
    return _.camelCase(output)
  }

  _prefixType = type => {
    if (!this.namespace) {
      return formatType(type)
    }
    return `${formatType(this.namespace)}/${formatType(type)}`
  }

  _mapCreatorTypes = actionCreators => {
    return _.mapValues(actionCreators, (actionCreator, type) => {
      const type2 = this._prefixType(type)
      return (...args) => ({
        type: type2,
        ...actionCreator(...args)
      })
    })
  }

  _bindDispatch = actionCreator => {
    return (...args) => this.dispatch(actionCreator(...args))
  }

  set store(store) {
    this.dispatch = store.dispatch
    const boundActions = _.mapValues(this.actionCreators, actionCreator => {
      return this._bindDispatch(actionCreator)
    })
    _.assign(this, boundActions)
    this._store = store
    this._registerWatch()
  }

  get store() {
    return this._store
  }

  connect(component, mapStateToProps = (state => state[this.namespace]), mapDispatch) {
    return connect(mapStateToProps, mapDispatch)(component)
  }
}

export const createModel = config => new Model(config)
