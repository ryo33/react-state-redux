import { fromJS } from 'immutable'

import { INIT, ADD_COMPONENT, REMOVE_COMPONENT, DISPATCH_TO } from './constants'

const initialState = {
  components: {}
}

const createComponent = (reducer, state) => ({ reducer, state })

export default function componentsReducer(state = initialState, action) {
  const { type, payload, meta } = action
  switch (type) {
    case ADD_COMPONENT:
      {
        const { id, reducer } = payload
        const initialState = reducer(undefined, { type: INIT })
        return fromJS(state)
          .setIn(['components', id], createComponent(reducer, initialState)).toJS()
      }
    case REMOVE_COMPONENT:
      {
        const { id } = payload
        return fromJS(state)
          .deleteIn(['components', id]).toJS()
      }
    case DISPATCH_TO:
      {
        const { id, action } = payload
        return fromJS(state).updateIn(['components', id], (component) => {
          return component
          .set('state', component.get('reducer')(component.get('state'), action))
        }).toJS()
      }
    default:
      return fromJS(state).update('components', (components) => {
        return components.map((component) => {
          return component
          .set('state', component.get('reducer')(component.get('state'), action))
        })
      }).toJS()
  }
}
