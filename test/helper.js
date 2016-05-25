import { createStore, combineReducers } from 'redux'

import reducer from '../src/reducer'

export const reducerA = (state = 0, { type, payload }) => {
  switch (type) {
    case 'INCREMENT':
      return state + 1
    case 'ADD':
      return state + payload
    case 'SET':
      return payload
    default:
      return state
  }
}

export const reducerB = (state = [], { type, payload }) => {
  switch (type) {
    case 'ADD':
      const ret = []
      ret.push(...state, payload)
      return ret
    default:
      return state
  }
}

export const counter = (state = 0, { type }) => {
  switch (type) {
    case 'INCREMENT':
      return state + 1
    default:
      return state
  }
}

export const getStore = () => {
  return createStore(combineReducers({
    reactStateRedux: reducer,
    counter
  }))
}
