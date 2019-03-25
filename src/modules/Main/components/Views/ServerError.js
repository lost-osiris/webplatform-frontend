import React, { Component } from 'react'

export default class ServerError extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="animated fadeInRight">
        <div className="card text-center">
          <div className="card-body card-padding">
            <h3><b>Server Error!</b></h3>
            <div className="error-desc">
              Please notify the Lead Developer <a href="mailto:mowens@redhat.com">Matthew Owens - mowens@redhat.com</a> if this issue persists.
            </div>
          </div>
        </div>
      </div>
    )
  }
}
