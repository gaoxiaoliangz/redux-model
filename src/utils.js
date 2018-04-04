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

export const generateSetActionCreator = (namespace, initialState) => {
  return (path, value) => {
    const pathArr = Array.isArray(path) ? path : parsePath(path)
    const firstPath = pathArr[0]
    if (_.isUndefined(initialState[firstPath])) {
      const msg = `key: ${firstPath} does not exist in ${namespace} state`
      console.error(msg)
      return {
        type: 'app/error',
        payload: msg
      }
    }
    return {
      type: namespace + '/$set:' + firstPath,
      payload: {
        path: pathArr,
        value
      },
    }
  }
}
