import { Component, createElement } from 'react'
import { connect } from 'react-redux'
import hoistStatics from 'hoist-non-react-statics'
import { fromJS } from 'immutable'
import uuid from 'uuid'

import { INIT, ADD_COMPONENT, REMOVE_COMPONENT, PROPS_ID, DISPATCH_TO } from './constants'

const defaultMapStateToProps = (state, componentState) => ({})
const defaultMapDispatchToProps = (dispatch, dispatchToThis) => ({ dispatch, dispatchToThis })

export default function connectToComponentState(mapStateToProps, mapDispatchToProps, mergeProps, options, options2) {
  const mapState = mapStateToProps || defaultMapStateToProps
  const mapDispatch = mapDispatchToProps || defaultMapDispatchToProps
  const finalMapStateToProps = (state, props) => {
    const id = props[PROPS_ID]
    const componentState = state.reactStateRedux.components[id].state
    return mapState(state, componentState, props)
  }
  const finalMapDispatchToProps = (dispatch, props) => {
    const id = props[PROPS_ID]
    const dispatchToThis = (action) => dispatch({
      type: DISPATCH_TO,
      payload: {
        id, action
      }
    })
    return mapDispatch(dispatch, dispatchToThis, props)
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
        const initialState = reducer(undefined, { type: INIT })
        this.state = {
          componentState: initialState
        }
      }

      componentWillMount() {
        this.props.dispatch({
          type: ADD_COMPONENT,
          payload: {
            id: this.componentID,
            reducer,
            state: this.state.componentState
          }
        })
      }

      componentWillUnmount() {
        this.props.dispatch({
          type: REMOVE_COMPONENT,
          payload: {
            id: this.componentID,
          }
        })
      }

      componentWillReceiveProps(nextProps) {
        const component = nextProps.reactStateRedux.components[this.componentID]
        if (component) {
          this.setState({
            componentState: component.state
          })
        }
      }

      render() {
        const props = fromJS(this.props)
        .set(PROPS_ID, this.componentID)
        .toJS()
        return this.props.reactStateRedux.components[this.componentID]
          ? createElement(
            finalWrappedComponent,
            props
          )
          : null
      }
    }
    return connect(
      ({ reactStateRedux }) => ({ reactStateRedux }), undefined, undefined, options2
    )(hoistStatics(ConnectToComponentState, finalWrappedComponent))
  }
}
