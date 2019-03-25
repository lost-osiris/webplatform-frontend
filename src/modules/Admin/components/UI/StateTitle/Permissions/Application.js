import React, { Component } from 'react'
import Utils from '~/utils'
import _ from 'lodash'

class Application extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('permissions.applications')
  }

  render() {
    return (
      <div className="animated fadeInRight">
        <h2>{_.startCase(this.props.match.params.name)} - Permissions</h2>
      </div>
    )
  }
}

export default Application
