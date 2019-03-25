import React, { Component } from 'react'
import Utils from '~/utils'
import { Button, Loading, Autocomplete } from '~/components'
import _ from 'lodash'
import Add from '../components/Add'

export default class AddContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('jobrunner.add')
    this.job = {
      interval: {
        ends: {},
      },
    }
    this.disabled = {
      showInterval: 'disabled',
      occurence: 'disabled',
      ondate: 'disabled',
      showRunTime: 'disabled',
    }
    this.newParam = {}
    this.checked = {
      never: false,
      ondate: false,
      occurence: false,
      showRunTime: false,
    }
    this.paramComponent = <span>None</span>
    this.params = {}
    this.job.admin = false

    this.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    this.errors = {
      name: '',
      api: '',
      description: '',
    }
  }

  UNSAFE_componentWillMount() {
    this.loading(true)
    this.weekComponent = ''

    var api = {
      path: 'api-info.get',
      data: {},
    }

    this.utils.request(api)
  }

  componentDidMount() {
    this.utils.getData().then((data) => {
      this.utils.dispatch('INIT', {data: data})
    })
  }

  UNSAFE_componentWillUpdate() {
    var stateObj = this.utils.getState()
    if (stateObj.data != undefined) {
      if (this.data != stateObj.data) {
        this.data = stateObj.data
        this.autocomplete = this.renderAutocomplete()
        this.loading(false)
      }
    }
  }

  handleChange(result) {
    if (result.exact) {
      this.job.api = result.result
    }
  }

  handleInputChange(event, type) {
    if (type == 'admin' || type == 'showInterval') {
      if (this.job[type] == undefined || this.job[type] == false) {
        this.job[type] = true
        this.disabled[type] = ''
      }
      else {
        this.job[type] = false
        this.disabled[type] = 'disabled'
      }
    }
    else if (type.search('interval') > -1) {
      var array = type.split('.')
      if (array.length == 3) {
        if (array[2] == 'on') {
          this.job.interval[array[1]][array[2]] = event
        }
        else {
          this.job.interval[array[1]][array[2]] = event.target.value
          if (event.target.value == '') {
            this.job.interval[array[1]][array[2]] = undefined
          }
        }
      }
      else {
        this.job.interval[array[1]] = event.target.value
        if (array[1] == 'repeats') {
          if (event.target.value == 'weekly') {
            this.weekComponent = this.createWeeksList()
            this.job.interval.days = {}
            for (var i = 0; i < this.weekdays.length; i++) {
              this.job.interval.days[this.weekdays[i]] = false
            }
          }
          else {
            this.weekComponent = ''
          }
        }
      }
    }
    else if (type == 'run_time') {
      this.job.run_time = event
    }
    else {
      this.job[type] = event.target.value
      if (event.target.value == '') {
        this.job[type] = undefined
      }
    }
    this.forceUpdate()
  }

  renderAutocomplete() {
    return (
      <Autocomplete
        placeholder={ 'Search by module name' }
        minSearch={ 1 } data={ this.data.modules }
        onChange={ (result) => this.handleChange(result) }
        isObject={ true }
        searchText={ this.searchText } />
    )
  }

  loading(isLoading) {
    this.setState({loading: isLoading})
  }

  handleToggle(type) {
    if (type == 'showRunTime') {
      if (this.checked[type] == false) {
        this.checked[type] = true
        this.disabled[type] = ''
      }
      else {
        this.checked[type] = false
        this.disabled[type] = 'disabled'
      }
    }
    else {
      this.job.interval.ends = {}
      this.job.interval.ends.mode = type
      var keys = ['ondate', 'occurence', 'never']
      for (var i = 0; i < keys.length; i++) {
        if (keys[i] == type) {
          this.checked[type] = true
          this.disabled[type] = ''
        }
        else {
          this.checked[keys[i]] = false
          this.disabled[keys[i]] = 'disabled'
        }
      }
    }
    this.forceUpdate()
  }

  handleNewParam(event, type) {
    this.newParam[type] = event.target.value
    this.forceUpdate()
  }

  submitNewParam() {
    if (this.newParam.type === 'list') {
      this.params[this.newParam.key] = this.newParam.value.split(',')
      this.job[this.newParam.key] = this.newParam.value.split(',')
    }
    else if (this.newParam.type == 'number') {
      this.params[this.newParam.key] = parseInt(this.newParam.value)
      this.job[this.newParam.key] = parseInt(this.newParam.value)
    }
    else {
      this.params[this.newParam.key] = this.newParam.value
      this.job[this.newParam.key] = this.newParam.value
    }
    this.newParam = {
      type: '',
    }
    this.paramComponent = (
      <table className="table table-hover">
        <thead>
          <tr>
            <td>Key</td>
            <td>Value</td>
            <td>Remove</td>
          </tr>
        </thead>
        <tbody>{ this.createParamComponent() }</tbody>
      </table>
    )
    this.forceUpdate()
  }

  createParamComponent() {
    return _.map(this.params, (value, k) => {
      return (
        <tr key={ k }>
          <td>{ k }</td>
          <td>{ value }</td>
          <td>
            <Button
              btnStyle="danger"
              onClick={() => this.removeParam(k)}
            >
              Remove
            </Button>
          </td>
        </tr>
      )
    })
  }

  removeParam(key) {
    delete this.params[key]
    delete this.job[key]
    this.paramComponent = (
      <table className="table table-hover">
        <thead>
          <tr>
            <td>Key</td>
            <td>Value</td>
            <td>Remove</td>
          </tr>
        </thead>
        <tbody>{ this.createParamComponent() }</tbody>
      </table>
    )
    this.forceUpdate()
  }

  resetIntervalErrors() {
    this.errors.ends = ''
    this.errors.repeats = ''
    this.errors.weekly = ''
    this.errors.occurences = ''
    this.errors.ondate = ''
    this.errors.runTime = ''
  }

  errorCheck() {
    var error = false
    var keys = ['name', 'description', 'api']
    for (var i = 0; i < keys.length; i++) {
      if (this.job[keys[i]] == undefined || this.job[keys[i]] == '') {
        this.errors[keys[i]] = ' c-red'
        error = true
      }
      else {
        this.errors[keys[i]] = ''
      }
    }

    if (this.job.showInterval) {
      this.resetIntervalErrors()
      if (this.job.interval.repeats == undefined || this.job.interval.repeats == '' || this.job.interval.every == undefined || this.job.interval.every == '') {
        this.errors.repeats = ' c-red'
        error = true
      }
      else {
        this.errors.repeats = ''
        if (this.job.interval.repeats == 'weekly' && this.job.interval.days == undefined) {
          this.errors.weekly = ' c-red'
          error = true
        }
        else if (this.job.interval.repeats == 'weekly' && this.job.interval.days != undefined) {
          this.errors.weekly = ''
        }
      }

      if (this.job.interval.ends == undefined || this.job.interval.ends.mode == undefined) {
        this.errors.ends = ' c-red'
        error = true
      }
      else {
        this.errors.ends = ''
        if (this.job.interval.ends.mode == 'occurence') {
          if (this.job.interval.ends.max_occurence == undefined) {
            this.errors.occurences = ' c-red'
            error = true
          }
          else {
            this.errors.occurences = ''
          }
        }
        else if (this.job.interval.ends.mode == 'ondate') {
          if (this.job.interval.ends.on == undefined || this.job.interval.ends.on == '') {
            this.errors.ondate = ' c-red'
            error = true
          }
          else {
            this.errors.ondate = ''
          }
        }
      }
    }

    if (this.checked.showRunTime) {
      if (this.job.run_time == undefined || this.job.run_time == '') {
        this.errors.runTime = ' c-red'
        error = true
      }
      else {
        this.errors.runTime = ''
      }
    }

    return error
  }

  submitJob() {
    var error = this.errorCheck()
    if (error) {
      this.forceUpdate()
      return
    }

    this.job.uid = this.utils.getUser().uid

    var data = JSON.parse(JSON.stringify(this.job))

    if (this.job.showInterval == false) {
      delete data.interval
    }
    delete data.showInterval
    var api = {
      path: 'jobs.scheduled.add',
      data: data,
    }

    this.utils.request(api)
    this.loading(true)

    this.utils.getData().then(() => {
      this.utils.push('/jobs')
    })
  }

  createWeeksList() {
    return this.weekdays.map((day) => {
      return (
        <div key={ day } className="animated fadeInDown">
          <div className="col-lg-1">
            <div className="row">
              <div className="col-lg-12 form-control">
                <input type="checkbox" className="fg-line" onClick={ () => this.toggleWeekday(day) } />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-lg-12">
                <label className="control-label"> { day.slice(0, 3) }</label>
              </div>
            </div>
          </div>
        </div>
      )
    })
  }

  toggleWeekday(weekday) {
    if (this.job.interval.days[weekday]) {
      this.job.interval.days[weekday] = false
    }
    else {
      this.job.interval.days[weekday] = true
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <Loading />
      )
    }

    return (
      this.props.children != null
        ? <div>{ this.props.children }</div>
        :
        <Add
          submitJob={ () => this.submitJob() }
          autocomplete={ this.autocomplete }
          handleInputChange={ (event, type) => this.handleInputChange(event, type) }
          job={ this.job }
          newParam={ this.newParam }
          disabled={ this.disabled }
          handleToggle={ (type) => this.handleToggle(type) }
          checked={ this.checked }
          handleNewParam={ (event, type) => this.handleNewParam(event, type) }
          paramComponent={ this.paramComponent }
          submitNewParam={ () => this.submitNewParam() }
          weekComponent={ this.weekComponent }
          errors={ this.errors }
        />
    )
  }
}
