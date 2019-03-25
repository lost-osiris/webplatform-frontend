import React, { Component } from 'react'
import Utils from '~/utils'
import moment from 'moment'
import { DropDown, FormatDate } from '~/components'

const icons = {
  finished: 'fa fa-check-circle-o',
  waiting: 'fa fa-clock-o',
  queued: 'fa fa-database',
  stopped: 'fa fa-ban',
  failed: 'fa fa-exclamation',
  all: 'fa fa-globe',
}

export default class Job extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('jobrunner.job')
  }

  componentWillMount() {
    this.isAdmin = 'No'
    if (this.props.job.admin) {
      this.isAdmin = 'Yes'
    }
  }

  componentWillReceiveProps(nextProps) {
    this.isAdmin = 'No'
    if (nextProps.job.admin) {
      this.isAdmin = 'Yes'
    }

    if (nextProps.job.results != undefined) {
      let results = nextProps.job.results
      if (results.length == 1) {
        results = nextProps.job.results[0]
        this.resultsComponent = this.renderJobResults(results)
      }
    }
  }

  componentWillUnmount() {
    if (this.props.job.results != undefined) {
      this.utils.dispatch('RESULTS', { results: undefined })
    }
  }

  renderJobResults(results) {
    var keys = ['kwargs', 'result', 'ttl_time', 'start_time', 'finish_time']
    var displayData = {}
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == 'kwargs' || keys[i] == 'result') {
        if (Object.keys(results[keys[i]]).length == 0) {
          displayData[keys[i]] = 'N/A'
        } else {
          if (typeof results[keys[i]] == 'string') {
            displayData[keys[i]] = <pre>{results[keys[i]]}</pre>
          } else {
            displayData[keys[i]] = (
              <code
                style={{
                  whiteSpace: 'pre-wrap',
                  backgroundColor: 'transparent',
                }}
              >
                {JSON.stringify(results[keys[i]], null, 2)}
              </code>
            )
          }
        }
      } else if (keys[i] == 'ttl_time') {
        displayData.ttlTime = results.ttl_time.toString()
        displayData.ttlTime = displayData.ttlTime.slice(0, 6)
      } else if (keys[i] == 'start_time' || keys[i] == 'finish_time') {
        var date = moment.utc(this.props.job.run_time)
        var localRuntime = moment(date).local()
        displayData[keys[i]] = moment(localRuntime).format('MM/D/YY, h:mm:s a')
      }
    }
    return (
      <div>
        <div className="row">
          <div className="col-lg-12 text-center p-b-20 p-t-20">
            <h2>
              <i className="fa fa-sitemap" />
              Results
            </h2>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <h3>
              <i className="zmdi zmdi-timer" />
              Start Time
            </h3>
            <div className="p-l-30">
              {displayData.start_time}
            </div>
          </div>
          <div className="col-lg-4">
            <h3>
              <i className="zmdi zmdi-time-interval" />
              End Time
            </h3>
            <div className="p-l-30">
              {displayData.finish_time}
            </div>
          </div>
          <div className="col-lg-4">
            <h3>
              <i className="zmdi zmdi-time-countdown" />
              Total Time
            </h3>
            <div className="p-l-30">
              {displayData.ttlTime}ms
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <h3>
              <i className="fa fa-key" />
              Kwargs
            </h3>
            <div className="p-l-30">
              {displayData.kwargs}
            </div>
          </div>
          <div className="col-lg-4">
            <h3>
              <i className="zmdi zmdi-layers" />
              Result
            </h3>
            <div className="p-l-30">
              {displayData.result}
            </div>
          </div>
          <div className="col-lg-4">
            <h3>
              <i className="zmdi zmdi-check-circle-u" />
              Status
            </h3>
            <div className="p-l-30">
              {results.status}
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const spanStyle = { marginLeft: '5px' }
    return (
      <div className="animated fadeInRight">
        <div className="card">
          <div className="card-header bgm-bluegray">
            <div className="row">
              <div className="col-lg-11">
                <h3 className="c-white">
                  {this.props.job.name}
                </h3>
              </div>
              <div className="col-lg-1 text-right">
                <h3>
                  <DropDown bgm="bgm-green" icon="zmdi zmdi-menu">
                    <li onMouseDown={() => this.props.rerunJob()}>
                      <a>
                        Rerun Job
                      </a>
                    </li>
                    <li onMouseDown={() => this.props.editJob()}>
                      <a>
                        Edit Job
                      </a>
                    </li>
                    <li onMouseDown={() => this.props.removeJob()}>
                      <a>
                        Remove Job
                      </a>
                    </li>
                  </DropDown>
                </h3>
              </div>
            </div>
          </div>
          <div className="card-body card-padding">
            <div className="pm-body clearfix">
              <div className="row">
                <div className="col-lg-4">
                  <h3>
                    <i className="fa fa-code" />
                    <span style={spanStyle}>
                      API
                    </span>
                  </h3>
                  <div className="p-l-30">
                    <p>
                      {this.props.job.api}
                    </p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <h3 className="">
                    <i className={icons[this.props.job.status]} />
                    <span style={spanStyle}>
                      Status
                    </span>
                  </h3>
                  <p className="p-l-30">
                    {this.props.job.status}
                  </p>
                </div>
                <div className="col-lg-4">
                  <h3>
                    <i className="fa fa-info-circle" />
                    <span style={spanStyle}>
                      Description
                    </span>
                  </h3>
                  <div className="p-l-30">
                    <p>
                      "{this.props.job.description}"
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4">
                  <h3>
                    <i className="fa fa-clock-o" />
                    <span style={spanStyle}>
                      Run Time
                    </span>
                  </h3>
                  <div className="p-l-30">
                    <p>
                      {/* {moment(this.props.localRuntime).format('MMMM Do YYYY, h:mm a')} */}
                      <FormatDate date={this.props.localRuntime} />
                    </p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <h3>
                    <i className="fa fa-calendar" />
                    <span style={spanStyle}>
                      Interval
                    </span>
                  </h3>
                  <div className="p-l-30">
                    <p>{this.props.job.displayInterval}</p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <h3>
                    <i className="fa fa-user" />
                    <span style={spanStyle}>
                      Creator
                    </span>
                  </h3>
                  <div className="p-l-30">
                    <p>{this.props.job.uid}</p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4">
                  <h3>
                    <i className="fa fa-users" />
                    <span style={spanStyle}>
                      Admin Job
                    </span>
                  </h3>
                  <div className="p-l-30">
                    <p>{this.isAdmin}</p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <h3>
                    <i className="fa fa-key" />
                    <span style={spanStyle}>
                      kwargs
                    </span>
                  </h3>
                  <div className="p-l-30">
                    <pre>{JSON.stringify(this.props.job.kwargs, null, 2)}</pre>
                  </div>
                </div>
              </div>
              {this.props.showResultsComponent}
              {this.resultsComponent}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
