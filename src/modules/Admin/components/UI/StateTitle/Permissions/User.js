import React, { Component } from 'react'
import Utils from '~/utils'

class User extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('permissions.user')
  }

  componentWillMount() {
    this.user = this.props.match.params
  }

  render() {
    return (
      <div className="animated fadeInRight">
        <h2>{ this.user.uid } - Permssions</h2>
      </div>
    )
  }
}

export default User
