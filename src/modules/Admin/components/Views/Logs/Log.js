import React, { Component } from 'react'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Card, Tabs, FormatDate } from 'webplatform-ui'

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
        component = <p style={{paddingLeft: '15px'}}>None</p>
      } else {
        component = (
          <ul style={{paddingLeft: '15px'}}>
            {
              data.map((item, index) => {
                return <li key={`${key}-list-${index}`}>{ item }</li>
              })
            }
          </ul>
        )
      }
    } else if (key === 'type' || key === 'exception_type' || key === 'stack_trace') {
      let escapedString = data.replace(/\\n/g, '\n')
      component = <pre>{ escapedString }</pre>
    } else if (_.isString(data)) {
      component = <div style={{paddingLeft: '15px'}}>{ data }</div>
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

    return Object.keys(details).map(key => {
      return (
        <div key={key} className="pmo-block pmo-contact">
          <h3><b>{ details[key] }</b></h3>
          { this.renderData(this.props.data[key], key) }
        </div>
      )
    })
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
          <h3>{ details[key] }</h3>
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
          <h3>{ details[key] }</h3>
          { this.renderData(this.props.data.request[key]) }
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
              <i className="fa fa-close text-danger" />
            </div>)
            : (
              <div>
                Status - <span> </span>
                <i className="fa fa-check text-success" />
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
      <Card>
        <Card.Title className="bgm-lgrey">
          <div className="row">
            <div className="col-lg-4">
              {this.renderTitle()}
            </div>
          </div>
        </Card.Title>
        <Card.SideNav>
          <div>
            { this.renderPlatformDetails() }
          </div>
        </Card.SideNav>
        <Card.Body>
          <Tabs current="request">
            <Tabs.Content className="content">
              <div key="request">
                { this.renderRequestDetails() }
              </div>
              <div key="response">
                { this.renderResponseDetails() }
              </div>
              <div key="failure">
                { this.renderFailureDetails() }
              </div>
            </Tabs.Content>
            <Tabs.Nav>
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
            </Tabs.Nav>
          </Tabs>
        </Card.Body>
      </Card>
    )
  }
}
