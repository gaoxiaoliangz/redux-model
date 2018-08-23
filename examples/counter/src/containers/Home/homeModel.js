import { createModel } from '@gxl/redux-model'
import { put, take, select } from 'redux-saga/effects'

const service = {
  updateCount(num, t = 1000) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(num)
      }, t)
    })
  }
}

const model = createModel({
  namespace: 'home',
  state: {
    count: 0,
  },
  // actionCreators: {
  //   test: () => ({ payload: 'ok', meta: 'test' })
  // },
  // reducer(state, action) {
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
      console.log('count is being watched:', val)
    }
  },
  effects: {
    *updateCountAsync() {
      yield service.updateCount()
      yield put(wait())
      yield take(WAIT_END)
      const { home: { count } } = yield select()
      yield put(updateCount(count + 1))
    },
    *updateCountAsyncQuick() {
      yield service.updateCount(null, 100)
      const { home: { count } } = yield select()
      yield put(updateCount(count + 1))
    },
    *wait(m) {
      yield service.updateCount()
      yield
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

const { updateCount, wait } = model.actionCreators
const { WAIT_END } = model.actionTypes
console.log(model)
export default model
