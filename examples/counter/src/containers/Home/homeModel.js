import { createModel } from 'redux-model'

export default createModel({
  namespace: 'home',
  state: {
    count: 0
  },
  actionCreators: {
    test: () => ({ payload: 'ok', meta: 'test' })
  },
  reducer(state, action) {
    // console.log(action)
    return state
  },
  // effects: {
  // },
  computations: {
    updateCount(state, count) {
      return {
        ...state,
        count
      }
    },
  }
})
