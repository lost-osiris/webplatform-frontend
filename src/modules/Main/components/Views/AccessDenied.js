import React, { Component } from 'react'

export default class AccessDeniedComponent extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="animated fadeInRight">
        <div className="card text-center">
          <div className="card-body card-padding">
            <h1>403</h1>
            <h3><b>Access Denied!</b></h3>
            <div className="error-desc">
              You do not have the proper permissions to view this page.
            </div>
          </div>
        </div>
      </div>
    )
  }
}
