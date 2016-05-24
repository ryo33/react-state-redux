import { Component, createElement } from 'react'
import { connect } from 'react-redux'
import hoistStatics from 'hoist-non-react-statics'
import { fromJS } from 'immutable'
import uuid from 'uuid'

import { ADD_COMPONENT, PROPS_ID, KEY_META } from './constants'

const defaultMapStateToProps = (state, componentState) => ({})
const defaultMapDispatchToProps = (dispatch, dispatchToThis) => ({ dispatch, dispatchToThis })

export default function connectToComponentState(mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
  const mapState = mapStateToProps || defaultMapStateToProps
  const mapDispatch = mapDispatchToProps || defaultMapDispatchToProps
  const finalMapStateToProps = (state, props) => {
    const id = props[PROPS_ID]
    const componentState = state.reactStateRedux.components[id].state
    return mapState(state, componentState)
  }
  const finalMapDispatchToProps = (dispatch, props) => {
    const id = props[PROPS_ID]
    const dispatchToThis = (action) => dispatch(
      fromJS(action).setIn(['meta', KEY_META, 'id'], id).toJS()
    )
    return mapDispatch(dispatch, dispatchToThis)
  }
  return (wrappedComponent, reducer) => {
    const finalWrappedComponent = connect(
      finalMapStateToProps,
      finalMapDispatchToProps,
      mergeProps,
      options
    )(wrappedComponent)
    class ConnectToComponentState extends Component {
      constructor(props, context) {
        super(props, context)
        this.componentID = uuid.v4()
        props.dispatch({
          type: ADD_COMPONENT,
          payload: {
            id: this.componentID,
            reducer
          }
        })
      }

      render() {
        const props = fromJS(this.props)
        .set(PROPS_ID, this.componentID)
        .toJS()
        return createElement(
          finalWrappedComponent,
          props
        )
      }
    }
    return connect()(hoistStatics(ConnectToComponentState, finalWrappedComponent))
  }
}
