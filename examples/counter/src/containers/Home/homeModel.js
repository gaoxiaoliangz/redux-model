import { createModel } from 'redux-model'

export default createModel({
  namespace: 'home',
  state: {
    init: 'none'
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
    init(state, payload = 'yes') {
      return {
        ...state,
        init: payload,
      }
    },
    sayyes(state, payload = 'hahah') {
      return {
        ...state,
        yes: payload
      }
    }
  }
})
