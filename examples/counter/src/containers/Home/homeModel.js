import { createModel } from 'redux-model'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

const service = {
  updateCount(num) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(num)
      }, 1000)
    })
  }
}

export default createModel({
  namespace: 'home',
  state: {
    count: 0
  },
  // actionCreators: {
  //   test: () => ({ payload: 'ok', meta: 'test' })
  // },
  // reducer(state, action) {
  //   // console.log(action)
  //   return state
  // },
  // *saga() {
  //   yield takeEvery('saga-ok', function*(action) {
  //     yield put({
  //       type: 'received'
  //     })
  //   })
  // },
  watch: {
    count(val) {
      console.log(val)
    }
  },
  effects: {
    *updateCountAsync(count) {
      const num = yield service.updateCount(count)
      this.updateCount(num)
    }
  },
  computations: {
    updateCount(state, count) {
      return {
        ...state,
        count
      }
    },
  }
})
