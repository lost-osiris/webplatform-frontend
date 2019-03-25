import React, {Component} from 'react'
import { connect } from 'react-redux'
import Utils from '~/utils'
import {Button, Loading } from '~/components'
import moment from 'moment'
import Job from '../components/Job'

class JobContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('jobrunner.job')
    this.id = this.props.match.params.id
    this.state = {
      loading: true,
    }

    this.job = undefined
  }

  UNSAFE_componentWillMount() {
    if (this.state.loading) {
      var api = {
        path: 'jobs.scheduled.get',
        data: {
          id: this.id
        }
      }

      this.utils.request(api).then((data) => {
        this.utils.dispatch('INIT', {job: data}).then(() => {
          this.setState({loading: false})
        })
      })
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (!nextState.loading) {
      this.job = this.setup(nextProps)
    }
  }

  setup(data) {
    let job = data.job

    var date = moment.utc(job.run_time)
    this.localRuntime = moment(date).local()

    if (job.status != 'queued'
      && job.status != 'waiting'
      && job.status != 'running') {

      if (data.results == undefined) {
        this.showResultsComponent = (
          <div className="row">
            <div className="col-lg-12 text-center">
              <Button
                btnStyle="primary"
                onClick={() => this.toggleResults()}
              >
                Show Results
              </Button>
            </div>
          </div>
        )

      } else {
        if (data.results != undefined && data.results.length == 1) {
          this.job.results = data.results
        }
        this.showResultsComponent = ''
      }

    } else {
      this.showResultsComponent = ''
    }

    return job
  }

  toggleResults() {
    var api = {
      path: 'jobs.results.list',
      data: {
        id: this.job.id
      }
    }

    this.utils.request(api).then((data) => {
      this.utils.dispatch('RESULTS', {data: data}).then(() => {
        if (data.length > 1) {
          this.utils.push('/jobs/results/' + this.job.id)
        }
      })
    })
  }

  rerunJob() {
    var api = {
      path: 'jobs.scheduled.edit',
      data: {
        id: this.job.id,
        mode: 'rerun'
      }
    }

    this.utils.request(api).then((data) => {
      if (data !== undefined) {
        this.utils.push('/jobs')
      }
    })
  }

  removeJob() {
    var api = {
      path: 'jobs.scheduled.remove',
      data: {
        id: this.job.id
      }
    }

    this.utils.request(api).then(() => {
      this.utils.push('/jobs')
    })
  }

  editJob() {
    this.utils.push('/jobs/edit/' + this.job.id)
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    }

    return (
      <Job
        localRuntime={ this.localRuntime }
        toggleResults={ () => this.toggleResults() }
        showResultsComponent={ this.showResultsComponent }
        rerunJob={ () => this.rerunJob() }
        removeJob={ () => this.removeJob() }
        editJob={ () => this.editJob() }
        job={ this.job } />
    )
  }
}

const mapStateToProps = (state) => {
  let newState = state.jobrunner.job
  return {
    results: newState.results,
    job: newState.job,
    api: newState.api
  }
}

export default connect(mapStateToProps)(JobContainer)
