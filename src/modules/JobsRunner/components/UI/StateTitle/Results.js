import React, { Component } from 'react'
import Utils from '~/utils'

class ResultsStateTitle extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.utils = new Utils('jobrunner.job')
    this.job = {}
  }

  componentWillUpdate() {
    var stateObj = this.utils.getState()
    if (stateObj.job != undefined && stateObj.job != this.job){
      this.job = this.utils.getState().job
    }
  }

  render() {
    return (
      <h1 className="animated fadeInRight">Job Results - { this.job.name }</h1>
    )
  }
}

export default ResultsStateTitle
