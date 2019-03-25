import React, { Component } from 'react'

import Utils from '~/utils'
import { Tabs } from '~/components'

import AdminMenu from './AdminMenu'
import JobsTable from './JobsTable'

const statuses = [
  'all',
  'waiting',
  'queued',
  'running',
  'finished',
  'stopped',
  'failed'
]
export default class JobsMain extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('jobrunner.main')
  }

  UNSAFE_componentWillMount() {
    this.data = this.props.data
    this.status = this.props.status

    this.isAdmin = false
    if (this.utils.checkPermissions('jobs', 'admin')) {
      this.isAdmin = true
    }

    this.nav = this.renderTabNav()
    this.content = this.renderTabContent()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.data = nextProps.data
    this.status = nextProps.status
    this.content = this.renderTabContent()
  }

  getJobs(status) {
    // this.utils.dispatch('CHANGE_TAB', {status: status});
    this.props.fetchJobs(this.props.container, status)
  }

  adminMenuAction(action) {
    let api
    if (action == 'update') {
      api = {
        path: 'jobs.refresh'
      }
    } else if (action == 'recover') {
      api = {
        path: 'jobs.recover'
      }
    } else if (action == 'stop') {
      api = {
        path: 'jobs.stop'
      }
    } else if (action == 'refresh') {
      return
    } else {
      this.utils.push('/jobs/add')
      return
    }

    this.utils.request(api)
    // this.utils.getData().then(() => {
    // this.loading(false);
    // });
  }

  renderTabNav() {
    return statuses.map((status) => {
      return (
        <a
          key={`${status}-link`}
          target={`${status}`}
          onClick={() => this.getJobs(status)}>
          {status.toTitleCase()}
        </a>
      )
    })
  }

  renderTabContent() {
    return statuses.map((status) => {
      return (
        <div key={`${status}-content`} id={`${status}`}>
          <JobsTable jobs={this.data} />
        </div>
      )
    })

  }

  render() {
    return (
      <div className="animated fadeInRight">
        <div className="card">
          <div className="card-header ch-alt">
            <div className="row">
              <div className="col-lg-4">
                <h3>Your Jobs</h3>
              </div>
              <div className="col-lg-8 text-right">
                <AdminMenu
                  admin={this.isAdmin}
                  action={(action) => this.adminMenuAction(action)} />
              </div>
            </div>
          </div>
          <div className="card-body car-padding">
            <Tabs type="tn-justified">
              <div type="nav">
                {this.nav}
              </div>
              <div type="content">
                {this.content}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}
