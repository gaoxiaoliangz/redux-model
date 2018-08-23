import { createStore, applyMiddleware, compose } from 'redux'
import { extractReducer, feedStore, extractSaga } from '@gxl/redux-model'
import createSagaMiddleware from 'redux-saga'
import homeModel from './containers/Home/homeModel'

const models = [homeModel]
const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
const enhancers = [
  applyMiddleware(...middlewares)
]
if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__) {
  enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__(window.__REDUX_DEVTOOLS_EXTENSION__OPTIONS))
}

const reducer = extractReducer(models)
const saga = extractSaga(models)
const store = createStore(reducer, {}, compose(...enhancers))

sagaMiddleware.run(saga)
feedStore(store, [homeModel])

export default store 
