import expect from 'expect'
import { Map } from 'immutable'

import reducer from '../src/reducer'
import { DISPATCH_TO, ADD_COMPONENT, REMOVE_COMPONENT } from '../src/constants'
import { reducerA, reducerB } from './helper'

describe('reducer', () => {
  const state = {
    components: {
      a: { reducer: reducerA, state: 0 },
      b: { reducer: reducerB, state: [] }
    }
  }

  it('dispatch ADD_COMPONENT', () => {
    expect(reducer(state, {
      type: ADD_COMPONENT,
      payload: { id: 'c', reducer: reducerA, state: 0 }
    })).toEqual({
      components: {
        a: { reducer: reducerA, state: 0 },
        b: { reducer: reducerB, state: [] },
        c: { reducer: reducerA, state: 0 }
      }
    })
  })

  it('dispatch REMOVE_COMPONENT', () => {
    expect(reducer(state, {
      type: REMOVE_COMPONENT,
      payload: { id: 'a' }
    })).toEqual({
      components: {
        b: { reducer: reducerB, state: [] }
      }
    })
  })

  it('dispatch ADD to both', () => {
    expect(reducer(state, {
      type: 'ADD',
      payload: 10
    })).toEqual({
      components: {
        a: { reducer: reducerA, state: 10 },
        b: { reducer: reducerB, state: [10] }
      }
    })
  })

  it('dispatch ADD to A', () => {
    expect(reducer(state, {
      type: DISPATCH_TO,
      payload: {
        id: 'a',
        action: {
          type: 'ADD',
          payload: 10
        }
      }
    })).toEqual({
      components: {
        a: { reducer: reducerA, state: 10 },
        b: { reducer: reducerB, state: [] }
      }
    })
  })

  it('dispatch ADD to B', () => {
    expect(reducer(state, {
      type: DISPATCH_TO,
      payload: {
        id: 'b',
        action: {
          type: 'ADD',
          payload: 10
        }
      }
    })).toEqual({
      components: {
        a: { reducer: reducerA, state: 0 },
        b: { reducer: reducerB, state: [10] }
      }
    })
  })
})
