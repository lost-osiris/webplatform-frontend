import React, { Component } from 'react'
import _ from 'lodash'

class Application extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h2>{_.startCase(this.props.match.params.name)} - Permissions</h2>
      </div>
    )
  }
}

export default Application
