React State Redux
====
Clear away states from React components.

Note: The name of this project is temporary yet.

## Description
It helps us move states to the Redux store from React components, especially when your components is dynamically used in many places.  

## Example
Suppose we have a simple textfield component like this:  
```javascript
import React, { Component } from 'react'

export default class TextField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ""
    }
  }
  handleChange(event) {
    this.setState({value: event.target.value})
  }
  render() {
    return <div>
      <input
        type="text"
        value={this.state.value}
        onChange={this.handleChange}
      />
    </div>
  }
}
```
We can rewrite it as a stateless component like this:  
```javascript
import React from 'react'

import { connect } from 'react-state-redux'

const mapStateToProps = (state, componentState) => ({
  value: componentState
})

function componentReducer(state = "", { type, payload }) {
  switch (type) {
    case 'CHANGE':
      return payload
    default:
      return state
  }
}

const TextField = ({ value, dispatchToThis }) => <div>
  <input
    type="text"
    value={value}
    onChange={(event) => dispatchToThis({type: 'CHANGE', payload: event.target.value})}
  />
</div>

export default connect(mapStateToProps)(TextField, componentReducer)
```

## Installation
`npm install --save react-state-redux`  

## Tutorial
```javascript
import { Provider } from 'react-redux'
import { reactStateReduxReducer } from 'react-state-redux'

// Add the reducer to your store on the `reactStateRedux` key
const store = createStore(
  combineReducers({
    ...reducers, // Your reducers
    reactStateRedux: reactStateReduxReducer
  })
)

// Prepare a component.
const MyComponent = ({ dispatch, dispatchToThis, componentState }) => <div>
  <DoSomething />
</div>

// Prepare a reducer to handle actions and return a component state.
function componentReducer(componentState = initialState, action) {
  switch (action.type) {
    case 'SOMETHING':
      return doSomething(componentState)
    default:
      return componentState
  }
}

// Connect to a Redux store and a component state.
const ConnectedMyComponent = connect(
  (state, componentState) => ({ componentState })
)(MyComponent, componentReducer)

// Use the connected component.
ReactDOM.render(
  <Provider store={store}>
    <ConnectedMyComponent />
  </Provider>,
  node
)
```

## API
Please see [React Redux API](https://github.com/reactjs/react-redux/blob/master/docs/api.md#arguments) if you have not done.  

### `connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options]) => (component, componentReducer) => connectedComponent`

##### `mapStateToProps(state, componentState, [ownProps]) => stateProps`
- `state` The same as `React Redux`'s one
- `componentState` The state of the component
- `ownProps` The same as `React Redux`'s one

##### `mapDispatchToProps(dispatch, dispatchToThis, [ownProps]) => dispatchProps`
- `dispatch` The same as `React Redux`'s one
- `dispatchToThis` The function to dispatch an action to the component only
- `ownProps` The same as `React Redux`'s one

##### `mergeProps` and `options`
They will be passed to the `React Redux's connect` directly.  

##### `component`
A React component you want to connect to a Redux store and a component state.  

##### `componentReducer(componentState, action): newComponentState`
A reducer to handle actions which is dispatched by `dispatchToThis` from the `component` and `dispatch` from anywhere.  

## License
MIT
