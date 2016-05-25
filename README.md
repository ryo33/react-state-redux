React State Redux
====
Clear away states from React components.

Note: The name of this project is temporary yet.

## Description
It helps us move states to the Redux store from React components, especially when your components is dynamically used in many places.  

## Example
Suppose we have a simple textfield component like this:  
```
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
```
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

## [WIP]API

### `connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])`

#### Arguments

##### `mapStateToProps`

##### `mapDispatchToProps`

##### `mergeProps` and `options`
They will be passed to `React Redux's connect` directly.  
See [React Redux API](https://github.com/reactjs/react-redux/blob/master/docs/api.md#arguments).  

## License
MIT
