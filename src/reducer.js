import { fromJS } from 'immutable'

import { ADD_COMPONENT, REMOVE_COMPONENT, DISPATCH_TO } from './constants'

const initialState = {
  components: {}
}

const createComponent = (reducer, state) => ({ reducer, state })

export default function reducer(state = initialState, action) {
  const { type, payload, meta } = action
  switch (type) {
    case ADD_COMPONENT:
      {
        const { id, reducer } = payload
        const componentState = payload.state
        return fromJS(state)
          .setIn(['components', id], createComponent(reducer, componentState)).toJS()
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
          if (component) {
            return component
              .set('state', component.get('reducer')(component.get('state'), action))
          }
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
