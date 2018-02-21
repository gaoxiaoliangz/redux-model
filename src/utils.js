import _ from 'lodash'
import { put, takeEvery, select } from 'redux-saga/effects'
import omitUndefinedDeep from './omitUndefinedDeep'

const parsePath = pathStr => {
  return pathStr
    .replace(/\[(.*?)\]/g, val => {
      const val2 = val.substr(1, val.length - 2)
      return `.${val2}`
    })
    .split('.')
    .map(path => {
      const num = parseInt(path, 10)
      return Number.isNaN(num) ? path : num
    })
}

export const updateInObject = (object, path, value) => {
  const pathArr = Array.isArray(path) ? path : parsePath(path)
  const clone = _.cloneDeep(object)
  const result = _.set(clone, path, value)
  const fKey = pathArr[0]
  return {
    ...result,
    [fKey]: omitUndefinedDeep(result[fKey])
  }
}

export const generateActionCreator = type => (payload, meta) => {
  return {
    type,
    payload,
    meta,
    error: payload instanceof Error ? true : undefined
  }
}

export const generateSetActionCreator = (namesapce, initialState) => {
  return (path, value) => {
    const pathArr = Array.isArray(path) ? path : parsePath(path)
    const firstPath = pathArr[0]
    if (_.isUndefined(initialState[firstPath])) {
      const msg = `key: ${firstPath} does not exist in ${namesapce} state`
      console.error(msg)
      return {
        type: 'app/error',
        payload: msg
      }
    }
    return {
      type: namesapce + '/set:' + firstPath,
      payload: {
        path: pathArr,
        value
      },
    }
  }
}

// export const createModel = ({ namespace, state, effects, reducers, subscriptions, watch, ...rest } = {}) => {
//   const effects2 = {
//     ...effects,
//     *$watch({ payload: { path, handler } }) {
//       let lastState = {}
//       yield takeEvery('*', function* handleTakeEvery() {
//         const currState = yield select()
//         const selfState = currState[namespace]
//         const lastVal = _.get(lastState, path)
//         const currVal = _.get(selfState, path)
//         if (!_.isEqual(lastVal, currVal)) {
//           handler({
//             value: currVal,
//             prevValue: lastVal,
//             state: currState
//           })
//         }
//         lastState = selfState
//         yield
//       })
//     },
//   }

//   const actionCreators = {
//     ...generateActionCreators(namespace, _.keys(effects2)),
//     ...generateActionCreators(namespace, _.keys(reducers)),
//     set: generateSetActionCreator(namespace, state),
//   }

//   const methods = {}

//   return {
//     ...rest,
//     namespace,
//     state,
//     effects: effects2,
//     methods,
//     reducers: {
//       ...generateSetReducers(state),
//       ...reducers
//     },
//     subscriptions: {
//       ...subscriptions,
//       _init({ dispatch }) {
//         methods.test = () => {
//           return dispatch({
//             type: 'test'
//           })
//         }
//         const dispatch2 = modDispatch(dispatch, namespace)
//         if (watch) {
//           _.forEach(watch, (handler, key) => {
//             dispatch2(actionCreators.$watch({
//               path: key,
//               handler: arg => {
//                 handler.call(null, {
//                   ...arg,
//                   dispatch: dispatch2
//                 })
//               }
//             }))
//           })
//         }
//       }
//     },
//     actionCreators
//   }
// }
