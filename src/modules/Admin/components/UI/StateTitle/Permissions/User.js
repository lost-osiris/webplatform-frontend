import React, { Component } from 'react'

class User extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="animated fadeInRight">
        <h2>{ this.props.match.params.uid } - Permssions</h2>
      </div>
    )
  }
}

export default User
