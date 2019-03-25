import React, { Component } from 'react'
import moment from 'moment'

import { Loading } from '~/components'
import Utils from '~/utils'

import Edit from '../components/Edit'

class EditContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('jobrunner.add')

    this.formType = 'add'
    this.state = {
      loading: false,
    }
  }

  UNSAFE_componentDidMount() {
    this.setup(this.props, this.state)
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    this.setup(nextProps, nextState)
  }

  setup(props, state) {
    let jobId = props.match.params.id

    if (jobId != undefined) {
      this.formType = 'edit'

      if (state.job == undefined && !state.loading) {
        this.getJob(jobId)
      }

      if (state.job != undefined && !state.loading && state.form == undefined) {
        let form = this.createForm(state.job)
        this.setState({ form: form })
      }
    } else {
      if (state.form == undefined) {
        let form = this.createForm()
        this.setState({ form: form })
      }
    }
  }

  getJob(id) {
    let api = {
      path: 'jobs.scheduled.get',
      data: {
        id: this.props.match.params.id,
      },
    }

    let stateObj = this.utils.getState('jobrunner.job')

    if (stateObj.job != undefined && stateObj.job.id == id) {
      this.setState({ job: stateObj.job, loading: false })
    } else {
      this.setState({ loading: true })
      this.utils.request(api).then(data => {
        this.setState({ loading: false, job: data })
      })
    }
  }

  submitJob(form) {
    const job = this.createJobData(form)
    job.uid = this.utils.getUser().uid
    job.id = this.props.match.params.id

    let api
    const data = JSON.parse(JSON.stringify(job))

    if (this.formType === 'add') {
      api = {
        path: 'jobs.scheduled.add',
        data,
      }
    } else {
      api = {
        path: 'jobs.scheduled.edit',
        data,
      }
    }

    this.utils.request(api)

    this.utils.getData().then((data) => {
      if (data !== undefined) {
        this.utils.push('/jobs')
      }
    })
  }

  createForm(job) {
    const form = {
      params: {},
      hasInterval: false,
      hasRunTime: false,
      interval: null,
      runTime: null,
      api: '',
      name: '',
      description: '',
      isAdmin: false,
      ondate: null,
      repeatScale: 'hourly',
      repeatInterval: 1,
      occurences: 1,
    }

    if (job != undefined) {
      Object.keys(job).forEach(key => {
        const value = job[key]
        if (key === 'kwargs') {
          form.params = value
        } else if (key === 'interval') {
          form.hasInterval = true
          if (value.days) {
            Object.keys(value.days).forEach(day => {
              form[day] = 'on'
            })
          }

          form.occurence = value['ends']['mode']
          if (form.occurence === 'occurence') {
            form.occurences = value['ends']['max_occurence']
          } else if (form.occurence === 'ondate') {
            form.ondate = value['ends']['on']
          }

          form.repeatScale = value['repeats']
          form.repeatInterval = value['every']
        } else if (key === 'admin') {
          form.isAdmin = value
        } else if (key === 'api') {
          form.api = value
        } else if (key === 'description') {
          form.description = value
        } else if (key === 'run_time') {
          form.hasRunTime = true
          form.runTime = moment(value)
        } else if (key === 'name') {
          form.name = value
        }
      })
    }

    return form
  }

  createJobData(form) {
    const weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const schema = {
      admin: '',
      name: '',
      api: '',
      description: '',
      run_time: '',
      interval: {
        ends: {
          mode: '',
          on: '',
          max_occurence: '',
        },
        repeats: '',
        every: '',
        days: {},
      },
    }

    Object.keys({ ...schema }).forEach(key => {
      if (key === 'admin') {
        schema[key] = form['isAdmin']
      } else if (key === 'run_time') {
        if (form.hasRunTime) {
          // converting timestamp to a UTC date
          let runTime = form['runTime']
          if (moment.isMoment(runTime)) {
            runTime = runTime.unix()
          } else {
            runTime = runTime / 1000
          }

          schema[key] = runTime
        } else {
          delete schema[key]
        }
      } else if (key === 'interval') {
        if (form['hasInterval']) {
          schema[key]['ends']['mode'] = form['occurence']
          schema[key]['repeats'] = form['repeatScale']
          schema[key]['every'] = form['repeatInterval']

          if (form['occurence'] === 'ondate') {
            schema[key]['ends']['on'] = form['ondate']
            delete schema[key]['ends']['max_occurence']
          } else if (form['occurence'] === 'occurence') {
            schema[key]['ends']['max_occurence'] = form['occurences']
          } else {
            delete schema[key]['ends']['on']
            delete schema[key]['ends']['max_occurence']
          }

          if (form['repeatScale'] === 'weekly') {
            weekdays.forEach(day => {
              if (form[day] === 'on') {
                schema[key]['days'][day] = true
              }
            })
          } else {
            delete schema[key]['days']
          }
        } else {
          delete schema['interval']
        }
      } else {
        schema[key] = form[key]
      }
    })

    if (form.params) {
      Object.keys(form.params).forEach(key => {
        schema[key] = form.params[key]
      })
    }

    return schema
  }

  render() {
    if (this.state.loading || this.state.form == undefined) {
      return <Loading />
    }

    let apis = this.utils.getSystemInfo()

    return (
      <div>
        <Edit
          type={this.formType}
          form={this.state.form}
          apis={apis.modules}
          onSubmit={job => this.submitJob(job)}
        />
      </div>
    )
  }
}

export default EditContainer
