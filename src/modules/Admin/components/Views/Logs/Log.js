import React, { Component } from 'react'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Tabs, FormatDate } from '~/components'

export default class Main extends Component {
  constructor(props) {
    super(props)
  }

  stringify(data) {
    let str = JSON.stringify(data, null, 2)
    return str.replace(/\\n/g, '\n')
  }

  renderData(data, key) {
    let component
    if (data === null || data === undefined) {
      data = 'None'
    }

    if (key === 'timestamp') {
      component = <FormatDate date={ data } />
    } else if (_.isArray(data)) {
      // const testData = ['a', 'b', 'c']
      if (data.length === 0) {
        component = <div>None</div>
      } else {
        component = (
          <ul style={{ listStyleType: 'disc' }}>
            {data.map(item => <li style={{ paddingLeft: '5px' }} key={item}>{ item }</li>)}
          </ul>
        )
      }
    } else if (key === 'type' || key === 'exception_type' || key === 'stack_trace') {
      let escapedString = data.replace(/\\n/g, '\n')
      component = <pre>{ escapedString }</pre>
    } else if (_.isString(data)) {
      component = <div>{ data }</div>
    } else if (_.isObject(data)) {
      component = <pre>{ this.stringify(data) }</pre>
    } else {
      component = <pre>{ data }</pre>
    }

    return component
  }

  renderPlatformDetails() {
    const details = {
      action: 'Action',
      path: 'Path',
      method: 'Method',
      source_ip: 'Source IP',
      uid: 'User ID',
      timestamp: 'Timestamp',
      permissions: 'Permissions',
    }

    const body = Object.keys(details).map(key => {
      return (
        <li style={{ paddingLeft: '5px' }} key={ key }>
          <h3><b>{details[key]}</b></h3>
          { this.renderData(this.props.data[key], key) }
        </li>
      )
    })

    return (
      <div className="pm-overview">
        <div className="pmo-block pmo-contact">
          <ul>
            {body}
          </ul>
        </div>
      </div>
    )
  }

  renderResponseDetails() {
    const details = {
      status: 'Status',
      headers: 'Headers',
      data: 'Data',
    }

    if (this.props.data.response && this.props.data.response.data) {
      this.props.data.response.data = JSON.parse(this.props.data.response.data)
    }

    return Object.keys(details).map(key => {
      return (
        <div key={key}>
          <h3>{details[key]}</h3>
          {!this.props.data.response ?
            <p>None</p>
          :
            this.renderData(this.props.data.response[key])
          }
        </div>
      )
    })
  }

  renderRequestDetails() {
    const details = {
      data: 'Data',
      kwargs: 'Keyword Arguments',
      headers: 'Headers',
      cookies: 'Cookies',
    }

    if (this.props.data.request.data.data) {
      this.props.data.request.data.data = JSON.parse(this.props.data.request.data.data)
    }

    if (this.props.data.request.data.form.data) {
      this.props.data.request.data.form.data = JSON.parse(this.props.data.request.data.form.data)
    }

    return Object.keys(details).map(key => {
      return (
        <div key={key}>
          <h3>{details[key]}</h3>
          {this.renderData(this.props.data.request[key])}
        </div>
      )
    })
  }

  renderFailureDetails() {
    const log = this.props.data.failure || {}

    return (
      <div>
        <h3>Failure Type</h3>
        {this.renderData(log.type, 'type')}
        <h3>Exception Type</h3>
        {this.renderData(log.exception_type, 'exception_type')}
        <h3>Stack Trace</h3>
        {this.renderData(log.stack_trace, 'stack_trace')}
      </div>
    )
  }

  renderTitle() {
    const failed = _.has(this.props.data, 'failure')

    return (
      <div>
        <h3 style={{ color: 'inherit' }}>
          {failed ? (
            <div>
              Status - <span> </span>
              <i className="fa fa-close c-red" />
            </div>)
            : (
              <div>
                Status - <span> </span>
                <i className="fa fa-check c-green" />
              </div>
            )}
        </h3>
      </div>
    )
  }

  render() {
    if (this.props.data === undefined) {
      return false
    }
    return (
      <div className="card animated fadeIn">
        <div className="card-header bgm-lgrey">
          <div className="row">
            <div className="col-lg-4">
              {this.renderTitle()}
            </div>
          </div>
        </div>
        <div className="card-body">
          <div id="profile-main">
            <Scrollbars style={ {left: 0, position: 'absolute', width: '300px', background: '#f8f8f8'} } autoHide>
              { this.renderPlatformDetails() }
            </Scrollbars>
            <div className="pm-body clearfix">
              <Tabs type="tn-justified" current="request">
                <div type="nav">
                  <a target="request">
                    <span>
                      <i className="fa fa-info text-info"></i> Request
                     </span>
                  </a>
                  <a target="response">
                    <span>
                      <i className="fa fa-close text-info text-info"></i> Response
                     </span>
                  </a>
                  <a target="failure">
                    <span>
                      <i className="fa fa-close text-info text-danger"></i> Failure
                     </span>
                  </a>
                </div>
                <div type="content">
                  <div id="request">
                    {this.renderRequestDetails()}
                  </div>
                  <div id="failure">
                    {this.renderFailureDetails()}
                  </div>
                  <div id="response">
                    {this.renderResponseDetails()}
                  </div>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
