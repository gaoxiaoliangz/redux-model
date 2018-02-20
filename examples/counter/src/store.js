import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { extractReducers, feedStore } from 'redux-model'
import homeModel from './containers/Home/homeModel'

const middlewares = []
const enhancers = [
  applyMiddleware(...middlewares)
]
if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__) {
  enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__(window.__REDUX_DEVTOOLS_EXTENSION__OPTIONS))
}

const reducer = extractReducers(homeModel)
const store = createStore(reducer, {}, compose(...enhancers))

feedStore(store, [homeModel])

export default store 
