import React from 'react'

import { connect } from '../../src/index'

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

const TextField = ({ value, dispatch, dispatchToThis }) => <div>
  <input
    value={value}
    onChange={(event) => dispatchToThis({type: 'CHANGE', payload: event.target.value})}
  />
</div>

export default connect(mapStateToProps)(TextField, componentReducer)
