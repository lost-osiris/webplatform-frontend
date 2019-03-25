import React, { Component } from 'react'
import Utils from '~/utils'
import moment from 'moment'
import { Collapse } from '~/components'

const icons = {
  finished: 'fa fa-check-circle-o',
  waiting: 'fa fa-clock-o',
  queued: 'fa fa-database',
  stopped: 'fa fa-ban',
  failed: 'fa fa-exclamation',
  all: 'fa fa-globe',
}

export default class Results extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('jobrunner.job')
    this.job = props.job
    this.results = props.results
  }

  componentWillMount() {
    this.resultsComponent = this.createCollapsibleResults()
  }

  createCollapsibleResults(){
    var results = this.results.reverse().map((result ,index) => {
      var date = moment.utc(result.start_time)
      var localRuntime = moment(date).local()
      var startTime = moment(localRuntime).format('MM/D/YY, h:mm:s a')
      var titleText = 'Result Time: ' + startTime + '\t\tStatus: ' + result.status
      var body = this.makeResultsComponent(result)
      return (
        <Collapse collapsed={ index == 0 ? true : false } key={`collpase-${index}`}>
          <div type="header">
            { titleText }
          </div>
          <div type="body">
            { body }
          </div>
        </Collapse>
      )
    })
    return results
  }

  makeResultsComponent(results) {
    var keys = ['kwargs', 'result', 'ttl_time', 'start_time', 'finish_time']
    var displayData = {}

    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == 'kwargs' || keys[i] == 'result') {
        if (Object.keys(results[keys[i]]).length == 0) {
          displayData[keys[i]] = 'N/A'
        }
        else {
          if (typeof results[keys[i]] == 'string') {
            displayData[keys[i]] = (<pre>{ results[keys[i]] }</pre>)
          }
          else {
            displayData[keys[i]] = (<code style={ { whiteSpace: 'pre-wrap', backgroundColor: 'transparent'} }>{JSON.stringify(results[keys[i]], null, 2)}</code>)
          }
        }
      }
      else if (keys[i] == 'ttl_time') {
        displayData.ttlTime = results.ttl_time.toString()
        displayData.ttlTime = displayData.ttlTime.slice(0, 6)
      }
      else if (keys[i] == 'start_time' || keys[i] == 'finish_time') {
        var date = moment.utc(results[keys[i]])
        var localRuntime = moment(date).local()
        displayData[keys[i]] = moment(localRuntime).format('MM/D/YY, h:mm:s a')
      }
    }

    return (
      <div>
        <div className="row">
          <div className="col-lg-4">
            <h3><i className="zmdi zmdi-timer"></i> Start Time</h3>
            <div className="p-l-30">
              { displayData.start_time }
            </div>
          </div>
          <div className="col-lg-4">
            <h3><i className="zmdi zmdi-time-interval"></i> End Time</h3>
            <div className="p-l-30">
              { displayData.finish_time }
            </div>
          </div>
          <div className="col-lg-4">
            <h3><i className="zmdi zmdi-time-countdown"></i> Total Time</h3>
            <div className="p-l-30">
              { displayData.ttlTime }ms
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <h3><i className="fa fa-key"></i> Kwargs</h3>
            <div className="p-l-30">
              { displayData.kwargs }
            </div>
          </div>
          <div className="col-lg-4">
            <h3><i className="zmdi zmdi-layers"></i> Result</h3>
            <div className="p-l-30">
              { displayData.result }
            </div>
          </div>
          <div className="col-lg-4">
            <h3><i className="zmdi zmdi-check-circle-u"></i> Status</h3>
            <div className="p-l-30">
              { results.status }
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="animated fadeInRight">
        <div className="card">
          <div className="card-header ch-alt">
            <div className="row">
              <div className="col-lg-12">
                <h3 >{ this.job.name }</h3>
              </div>
              <div className="col-lg-4">
                <h3>
                  <i className="fa fa-code"></i>
                  <span> API</span>
                </h3>
                <div className="p-l-30">
                  <p> { this.job.api } </p>
                </div>
              </div>
              <div className="col-lg-4">
                <h3>
                  <i className="fa fa-user"></i>
                  <span> Creator</span>
                </h3>
                <div className="p-l-30">
                  <p>{ this.job.uid }</p>
                </div>
              </div>
              <div className="col-lg-4">
                <h3 className="">
                  <i className={ icons[this.job.status] }></i>
                  <span> Status</span>
                </h3>
                <p className="p-l-30">
                  { this.job.status }
                </p>
              </div>
            </div>
          </div>
          <div className="card-body card-padding">
            { this.resultsComponent }
          </div>
        </div>
      </div>
    )
  }
}
