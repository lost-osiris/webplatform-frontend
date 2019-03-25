import React, { Component } from 'react'
import Utils from '~/utils'
import { Button, Loading, Link } from '~/components'
import JobsMain from '../components/Main'
import moment from 'moment'

const textColor = {
  finished: 'label bgm-green',
  failed: 'label bgm-red',
  queued: 'label bgm-blue',
  waiting: 'label bgm-orange',
  running: 'label bgm-purple',
  stopped: 'label bgm-pink',
}

export default class JobsMainContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('jobrunner.main')
    this.status = this.props.match.params.status
    this.uid = this.props.match.params.uid
    this.isAdmin = this.props.match.params.isAdmin
  }

  componentWillMount() {
    this.loading(true)

    var data = {
      uid: this.uid,
      status: this.status,
    }

    if (this.isAdmin == 'true' && this.utils.checkPermissions('jobs', 'admin')) {
      data.admin = true
      this.buttonGroup = this.makeButtonGroup()
    }
    else {
      this.buttonGroup = ''
    }

    var api = {
      path: 'jobs.scheduled.list',
      data: data,
    }

    this.utils.request(api)
  }

  componentDidMount() {
    this.utils.getData().then((data) => {
      this.utils.dispatch('INIT', {data: data, status: this.status})
    })
  }

  componentWillReceiveProps(nextProps) {
    var changeInAdmin = false
    if (nextProps.match.params.isAdmin != this.isAdmin) {
      this.isAdmin = nextProps.match.params.isAdmin
      changeInAdmin = true
    }
    if (nextProps.match.params.status != this.status || changeInAdmin) {
      this.status = nextProps.match.params.status
      this.uid = nextProps.match.params.uid

      if (this.utils.getState()[this.status] == undefined || changeInAdmin) {
        this.loading(true)
        var data = {
          uid: this.uid,
          status: this.status,
        }

        if (this.isAdmin == 'true' && this.utils.getUser().permissions.is_job_admin) {
          data.admin = true
          this.buttonGroup = this.makeButtonGroup()
        }
        else {
          this.buttonGroup = ''
        }

        var api = {
          path: 'jobs.scheduled.list',
          data: data,
        }

        this.utils.request(api)

        this.utils.getData().then((data) => {
          this.utils.dispatch('INIT', {data: data, status: this.status})
          this.loading(false)
        })
      }
    }
  }

  componentWillUpdate() {
    var stateObj = this.utils.getState()
    if (stateObj[this.status] != undefined) {
      if (this.data != stateObj[this.status]) {
        this.data = stateObj[this.status]
        this.loading(false)
      }
      this.jobsTable = this.makeJobsTable(this.data)
    }
  }

  makeJobsTable(jobs) {
    var body
    if (jobs.length > 0) {
      body = jobs.map((job) => {
        var date = moment.utc(job.run_time*1000)
        var localdate = moment(date).local()

        return (
          <tr key={ job.id }>
            <td><span className={ textColor[job.status] }>{ job.status }</span></td>
            <td><Link to={ `/jobs/job/${ job.id }` }>{ job.name }</Link></td>
            <td>{ job.api }</td>
            <td>{ moment(localdate).format('MMMM Do YYYY, h:mm a') }</td>
          </tr>
        )
      })
    }
    else {
      body = (
        <tr>
          <td></td>
          <td></td>
          <td>No results</td>
          <td></td>
          <td></td>
        </tr>
         )
    }

    var statuses = ['all', 'waiting', 'queued', 'running', 'finished', 'stopped', 'failed']
    var tabs = statuses.map((status) => {
      var isActive = ''
      if (this.status == status) {
        isActive = 'active'
      }
      var uid = this.uid
      return (
        <li key={ status } className={ isActive }>
          <Link to={ `/jobs/user/${ uid }/${ status }/${ this.isAdmin }` }>
            { status }
          </Link>
        </li>
      )
    })

    return (
      <div className="tabspanel">
        <ul className="tab-nav tn-justified">
          { tabs }
        </ul>
        <table className="table table-hover">
          <thead>
            <tr>
              <td><b>Status</b></td>
              <td><b>Name</b></td>
              <td><b>Job</b></td>
              <td><b>Runtime</b></td>
            </tr>
          </thead>
          <tbody>
            { body }
          </tbody>
        </table>
      </div>
    )
  }

  componentWillUnmount() {
  }

  updateApis() {
    var api = {
      path: 'jobs.refresh',
    }

    this.loading(true)
    this.utils.request(api)
    this.utils.getData().then(() => {
      this.loading(false)
    })
  }

  recoverJobs() {
    var api = {
      path: 'jobs.recover',
    }

    this.loading(true)
    this.utils.request(api)
    this.utils.getData().then(() => {
      this.loading(false)
    })
  }

  stopScheduler() {
    var api = {
      path: 'jobs.stop',
    }

    this.loading(true)
    this.utils.request(api)
    this.utils.getData().then(() => {
      this.loading(false)
    })
  }

  makeButtonGroup() {
    let padding = {marginRight: '5px'}
    return (
      <span>
        <Button
          btnStyle="warning"
          style={padding}
          onClick={() => this.updateApis()}
        >
          Update APIs
        </Button>
        <Button
          btnStyle="danger"
          style={padding}
          onClick={() => this.stopScheduler()}
        >
          Stop Scheduler
        </Button>
        <Button
          btnStyle="success"
          style={padding}
          onClick={() => this.recoverJobs()}
        >
          Recover Jobs
        </Button>
      </span>
    )
  }

  loading(isLoading) {
    this.setState({loading: isLoading})
  }


  render() {
    if (this.state.loading) {
      return (
        <Loading />
      )
    }

    return (
      <JobsMain
            buttonGroup={ this.buttonGroup }
            jobsTable={ this.jobsTable }
         />
    )
  }
}
