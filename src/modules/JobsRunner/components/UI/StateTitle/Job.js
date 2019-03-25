import React, { Component } from 'react'
import Utils from '~/utils'

class JobStateTitle extends Component {
  componentWillMount() {
    this.utils = new Utils('jobrunner.job')
    this.job = {}
  }

  componentWillUpdate() {
    var stateObj = this.utils.getState()
    if (stateObj.job != undefined && stateObj.job != this.job) {
      this.job = stateObj.job
    }

  }

  render() {
    return (
      <h1 className="animated fadeInRight">Job - { this.job.name }</h1>
    )
  }
}

export default JobStateTitle
