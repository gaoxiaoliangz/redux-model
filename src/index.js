import _ from 'lodash'
import { combineReducers } from 'redux'
import { connect } from 'react-redux'
import { put, fork, takeEvery } from 'redux-saga/effects'
import { generateActionCreator, generateSetActionCreator, updateInObject } from './utils'

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
    yield models
      .map(model => model.saga)
      .filter(Boolean)
      .map(saga => fork(saga))
  }
}

class Model {
  constructor({
    namespace,
    state,
    actionCreators,
    reducer,
    computations,
    saga,
    effects,
  } = {}) {
    const self = this
    this.namespace = namespace
    this.initialState = state

    // get types
    // todo: reserved types
    const types = _.keys(computations)
    _.keys(effects)
      .concat(_.keys(actionCreators))
      .forEach(key => {
        if (types.includes(key)) {
          console.warn(`Duplicated key '${key}' found! ('computations', 'effects' and 'actionCreators' should not contain the same key)`)
        } else {
          types.push(key)
        }
      })
    this.actionTypes = types

    // generate action creators
    const generatedActionCreators = types.reduce((creators, type) => {
      return {
        ...creators,
        [type]: this._generateActionCreator(type)
      }
    }, {})
    this._actionCreators = {
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
      if (computations[type]) {
        return computations[type](state1, action.payload, action.meta, action.error)
      }
      return state1
    }

    // saga
    if (saga || effects) {
      this.saga = function* () {
        yield [
          ...saga ? [fork(saga.bind(self))] : [],
          ...effects
            ? _.map(effects, (generator, key) => {
              return fork(this._effectToSaga(key, generator.bind(self)))
            })
            : []
        ]
      }.bind(this)
    }
  }

  _builtInReducer = (state, action) => {
    const { payload, type } = action
    if (type.startsWith(`${this.namespace}/set:`)) {
      return updateInObject(state, payload.path, payload.value)
    }
    return state
  }

  _effectToSaga(key, generator) {
    const type = this._prefixType(key)
    return function* () {
      yield takeEvery(type, function* (action) {
        yield put({ type: type + '@start' })
        yield generator(action.payload, action.meta, action.error)
        yield put({ type: type + '@end' })
      })
    }
  }

  _generateActionCreator = type => generateActionCreator(this._prefixType(type))

  _unprefixType = type => {
    const typePrefix = this.namespace + '/'
    if (type.startsWith(typePrefix)) {
      return type.substr(typePrefix.length)
    }
    return type
  }

  _prefixType = type => {
    if (!this.namespace) {
      return type
    }
    return `${this.namespace}/${type}`
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
    const bindedActions = _.mapValues(this._actionCreators, actionCreator => {
      return this._bindDispatch(actionCreator)
    })
    _.assign(this, bindedActions)
    this._store = store
  }

  get store() {
    return this._store
  }

  connect(component, mapStateToProps, mapDispatch) {
    return connect(mapStateToProps = (state => state[this.namespace]), mapDispatch)(component)
  }
}

export const createModel = config => new Model(config)
