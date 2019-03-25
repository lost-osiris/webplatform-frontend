import React, { Component } from 'react'
import { connect } from 'react-redux'
import Utils from '~/utils'
import { Loading } from '~/components'
// import Job from '../components/Job'
// import ReactMarkdown from 'react-markdown'
import Results from '../components/Results'

class ResultsContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('jobrunner.job')
    this.state = {
      loading: true
    }
    this.id = props.match.params.id
  }

  componentWillMount() {
    if (this.props.job == undefined) {
      var api = {
        job: {
          path: 'jobs.scheduled.get',
          data: {
            id: this.id
          }
        },
        results: {
          path: 'jobs.results.list',
          data: {
            id: this.id
          }
        }
      }

      this.utils.request(api).then((api) => {
        api.job.then((job) => {
          api.results.then((results) => {
            this.job = job
            this.results = results
            this.utils.dispatch('INIT', {job: job}).then(() => {
              this.utils.dispatch('RESULTS', {data: results}).then(() => {
                this.setState({loading: false})
              })
            })
          })
        })
      })
    } else {
      this.job = this.props.job
      this.results = this.props.results
      this.setState({loading: false})
    }
  }

  componentWillUnmount() {
    this.utils.dispatch('RESULTS', {results: undefined})
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    }

    return <Results results={this.results} job={this.results} />
  }
}

const mapStateToProps = (state) => {
  let newState = state.jobrunner.job
  return {
    results: newState.results,
  }
}

export default connect(mapStateToProps)(ResultsContainer)
