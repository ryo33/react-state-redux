import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger';

import { reactStateReduxReducer } from '../../src/index'

import Example from './Example'

const logger = createLogger()
const store = createStore(
  combineReducers({
    reactStateRedux: reactStateReduxReducer,
  }),
  applyMiddleware(logger)
)

render(<div>
  <h1>React State Redux</h1>
  <Provider store={store}>
    <Example />
  </Provider>
</div>, document.getElementById('root'))
