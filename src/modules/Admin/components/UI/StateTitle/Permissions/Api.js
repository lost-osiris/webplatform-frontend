import React, { Component } from 'react'
// import Utils from '~/utils'

class Api extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h2>API - { this.props.api.module } - Permissions</h2>
      </div>
    )
  }
}

export default Api
