import React, { Component } from 'react'
import Utils from '~/utils'

class Api extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('permissions.api')
  }

  componentWillMount() {
    var stateObj = this.utils.getState()

    if (stateObj.api != undefined) {
      this.api = stateObj.api.module
    }
  }

  componentWillReceiveProps() {
    var stateObj = this.utils.getState()

    if (stateObj.api != undefined) {
      this.api = stateObj.api.module
    }
  }

  render() {
    return (
      <div className="animated fadeInRight">
        <h2>API - { this.api } - Permissions</h2>
      </div>
    )
  }
}

export default Api
