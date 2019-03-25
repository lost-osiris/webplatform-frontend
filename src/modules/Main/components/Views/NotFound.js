import React, { Component } from 'react'

export default class NotFound extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="animated fadeInRight">
        <div className="card text-center">
          <div className="card-body card-padding">
            <h1>404</h1>
            <h3><b>Page Not Found!</b></h3>
            <div className="error-desc">
              Sorry, but the page you are looking for has not been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.
            </div>
          </div>
        </div>
      </div>
    )
  }
}
