import { expect } from 'chai'
import React, { Component } from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import TestUtils from 'react-addons-test-utils'

import './browser_setup'
import { getStore, reducerA, reducerB } from './helper.js'

import connect from '../src/connect'
import { PROPS_ID } from '../src/constants'

describe('connect', () => {
  class Child extends Component {
    render() {
      return <div />
    }
  }
  const Connect = connect()(Child, state => state)

  class A extends Component {
    render() {
      return <div />
    }
  }
  const ConnectA = connect((state, componentState) => ({
    state, componentState
  }), (dispatch, dispatchToThis) => ({
    dispatch, dispatchToThis
  }))(A, reducerA)

  class B extends Component {
    render() {
      return <div />
    }
  }
  const ConnectB = connect((state, componentState) => ({
    state, componentState
  }), (dispatch, dispatchToThis) => ({
    dispatch, dispatchToThis
  }))(B, reducerB)

  it('should receive the props correctly', () => {
    const store = getStore()

    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Connect a="a" b="b">c</Connect>
      </Provider>
    )

    const child = TestUtils.findRenderedComponentWithType(tree, Child)
    const connect = TestUtils.findRenderedComponentWithType(tree, Connect)
    expect(child.props.a).to.equal('a')
    expect(child.props.b).to.equal('b')
    expect(child.props.children).to.equal('c')
    expect(child.props[PROPS_ID]).to.match(/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/)
  })

  it('dispatch ADD to both', () => {
    const store = getStore()

    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <div>
          <ConnectA />
          <ConnectB />
        </div>
      </Provider>
    )

    const a = TestUtils.findRenderedComponentWithType(tree, A)
    const b = TestUtils.findRenderedComponentWithType(tree, B)

    a.props.dispatch({
      type: 'ADD',
      payload: 10
    })
    expect(a.props.componentState).to.equal(10)
    expect(b.props.componentState).to.deep.equal([10])
    b.props.dispatch({
      type: 'ADD',
      payload: 5
    })
    expect(a.props.componentState).to.equal(15)
    expect(b.props.componentState).to.deep.equal([10, 5])
  })

  it('dispatch ADD to A', () => {
    const store = getStore()

    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <div>
          <ConnectA />
          <ConnectB />
        </div>
      </Provider>
    )

    const a = TestUtils.findRenderedComponentWithType(tree, A)
    const b = TestUtils.findRenderedComponentWithType(tree, B)

    a.props.dispatchToThis({
      type: 'ADD',
      payload: 10
    })
    expect(a.props.componentState).to.equal(10)
    expect(b.props.componentState).to.deep.equal([])
  })

  it('dispatch ADD to B', () => {
    const store = getStore()

    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <div>
          <ConnectA />
          <ConnectB />
        </div>
      </Provider>
    )

    const a = TestUtils.findRenderedComponentWithType(tree, A)
    const b = TestUtils.findRenderedComponentWithType(tree, B)

    b.props.dispatchToThis({
      type: 'ADD',
      payload: 10
    })
    expect(a.props.componentState).to.equal(0)
    expect(b.props.componentState).to.deep.equal([10])
  })

  it('dispatch INCREMENT', () => {
    const store = getStore()

    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <div>
          <ConnectA />
          <ConnectB />
        </div>
      </Provider>
    )

    const a = TestUtils.findRenderedComponentWithType(tree, A)
    const b = TestUtils.findRenderedComponentWithType(tree, B)

    expect(a.props.state.counter).to.equal(0)
    expect(b.props.state.counter).to.deep.equal(0)
    a.props.dispatch({
      type: 'INCREMENT'
    })
    expect(a.props.state.counter).to.equal(1)
    expect(b.props.state.counter).to.deep.equal(1)
    b.props.dispatch({
      type: 'INCREMENT'
    })
    expect(a.props.state.counter).to.equal(2)
    expect(b.props.state.counter).to.deep.equal(2)
  })
})
