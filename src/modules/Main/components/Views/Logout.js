import React, { Component } from 'react'
import Cookies from 'universal-cookie'

export default class LogoutComponent extends Component {
  constructor(props) {
    super(props)
    this.cookies = new Cookies()
  }

  UNSAFE_componentWillMount() {
    this.cookies.remove('login', {path: '/'})
  }

  render() {
    return (
      <div className="animated fadeInRight">
        <div className="card text-center">
          <div className="card-body card-padding">
            <h1>You Successfully Logged Out</h1>
            <div className="error-desc">
              If you would like to sign back in <a href="/">Click Here</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
