import _ from 'lodash'
import { combineReducers } from 'redux'

export const feedStore = (store, models) => {
  models.forEach(model => {
    model.store = store
  })
}

export const extractReducers = (...models) => {
  return combineReducers(models.reduce((obj, model) => {
    return {
      ...obj,
      [model.namespace]: model.reducer
    }
  }, {}))
}

const generateActionCreator = type => (payload, meta) => {
  return {
    type,
    payload,
    meta,
    error: payload instanceof Error ? true : undefined
  }
}

class Model {
  constructor({ namespace, state, computations, effects, actionCreators, reducer } = {}) {
    this.namespace = namespace
    this.initialState = state

    // get types
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
      ...this._mapCreatorTypes(actionCreators)
    }

    // generate reducer
    this.reducer = (state = this.initialState, action) => {
      const state1 = reducer
        ? reducer(state, action)
        : state
      const type = this._unprefixType(action.type)
      if (computations[type]) {
        return computations[type](state1, action.payload, action.meta, action.error)
      }
      return state1
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
  }
}

export const createModel = config => new Model(config)
