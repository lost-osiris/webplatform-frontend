import React, {Component} from 'react'
import { Button, Inputs } from '~/components'
import Datetime from 'react-datetime'

export default class Edit extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="animated fadeInRight">
        <div className="card">
          <div className="card-header ch-alt">
            <h3>Edit a new job to the scheduler</h3>
          </div>
          <div className="card-body card-padding">
            <br />
            <div className="row">
              <div className="col-lg-8">
                <div className="row">
                  <div className="col-lg-12">
                    <label className={this.props.errors.api}>Choose an API</label>
                    {this.props.autocomplete}
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-lg-6">
                    <div className="row">
                      <div className="col-lg-3">
                        <label className={this.props.errors.name}>Name<sup>*</sup>
                        </label>
                      </div>
                      <div className="col-lg-9">
                        <Inputs.Text value={this.props.job.name}
                          onChange={(event) => this.props.handleInputChange(event, 'name')}
                          placeholder="Enter name here" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="row">
                      <div className="col-lg-3">
                        <label className={this.props.errors.description}>Description<sup>*</sup>
                        </label>
                      </div>
                      <div className="col-lg-9">
                        <textarea value={this.props.job.description}
                          className="form-control"
                          rows="5"
                          onChange={(event) => this.props.handleInputChange(event, 'description')}
                          placeholder="Enter name here" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="toggle-switch toggle-switch-demo">
                          <input value={this.props.job.admin}
                            onChange={(event) => this.props.handleInputChange(event, 'admin')}
                            type="checkbox" />
                          <label htmlFor="ts1" className="ts-helper"></label>
                          <label htmlFor="ts1" className="ts-label-right">Set as an admin job</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-lg-6">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="toggle-switch toggle-switch-demo">
                          <input value={this.props.job.showInterval}
                            onChange={(event) => this.props.handleInputChange(event, 'showInterval')}
                            type="checkbox"
                            checked={this.props.job.showInterval} />
                          <label htmlFor="ts1" className="ts-helper"></label>
                          <label htmlFor="ts1" className="ts-label-right">Set an interval</label>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-lg-3">
                        <label className={this.props.errors.repeats}>Repeats Every</label>
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      {/* <div className="col-lg-3"> */}
                      {/*    <label>Every</label> */}
                      {/* </div> */}
                      <div className="col-lg-2">
                        <input type="number"
                          value={this.props.job.interval.every}
                          onChange={(event) => this.props.handleInputChange(event, 'interval.every')}
                          className="form-control"
                          disabled={this.props.disabled.showInterval} />
                      </div>
                      <div className="col-lg-7">
                        <select value={this.props.job.interval.repeats} onChange={(event) => this.props.handleInputChange(event, 'interval.repeats')} className="form-control" disabled={this.props.disabled.showInterval}>
                          <option></option>
                          <option value="hourly">Hours</option>
                          <option value="daily">Days</option>
                          <option value="weekly">Weeks</option>
                          <option value="monthly">Months</option>
                          <option value="yearly">Years</option>
                        </select>
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      {this.props.weekComponent}
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-lg-3">
                        <label className={this.props.errors.ends}>Ends</label>
                      </div>
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="toggle-switch toggle-switch-demo">
                              <input value={this.props.job.interval.ends.mode}
                                type="checkbox"
                                onChange={() => this.props.handleToggle('never')}
                                disabled={this.props.disabled.showInterval}
                                checked={this.props.checked.never} />
                              <label htmlFor="ts1" className="ts-helper"></label>
                              <label htmlFor="ts1" className="ts-label-right">Never</label>
                            </div>
                          </div>
                        </div>
                        <br />
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="toggle-switch toggle-switch-demo">
                              <input value={this.props.job.interval.ends.mode}
                                type="checkbox"
                                onChange={() => this.props.handleToggle('occurence')}
                                disabled={this.props.disabled.showInterval}
                                checked={this.props.checked.occurence} />
                              <label htmlFor="ts1" className="ts-helper"></label>
                              <label htmlFor="ts1" className="ts-label-right">After some occurences</label>
                            </div>
                          </div>
                        </div>
                        <br />
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="toggle-switch toggle-switch-demo">
                              <input value={this.props.job.interval.ends.mode}
                                onChange={() => this.props.handleToggle('ondate')}
                                type="checkbox"
                                disabled={this.props.disabled.showInterval}
                                checked={this.props.checked.ondate} />
                              <label htmlFor="ts1" className="ts-helper"></label>
                              <label htmlFor="ts1" className="ts-label-right">On a specific date</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-lg-3"></div>
                      <div className="col-lg-2">
                        <label className={this.props.errors.occurences}>After</label>
                      </div>
                      <div className="col-lg-2">
                        <input disabled={this.props.disabled.occurence}
                          type="number"
                          value={this.props.job.interval.ends.max_occurence}
                          onChange={(event) => this.props.handleInputChange(event, 'interval.ends.max_occurence')}
                          className="form-control" />
                      </div>
                      <div className="col-lg-2">
                        Occurences
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-lg-3"></div>
                      <div className="col-lg-1">
                        <label className={this.props.errors.ondate}>On</label>
                      </div>
                      <div className="col-lg-5">
                        <Datetime className="form-control"
                          closeOnSelect={true}
                          timeFormat={true}
                          value={this.props.job.interval.ends.on}
                          onChange={(event) => this.props.handleInputChange(event, 'interval.ends.on')}
                          inputProps={{ disabled: this.props.disabled.ondate}} />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="toggle-switch toggle-switch-demo">
                          <input value={this.props.job.showRuntime}
                            onChange={() => this.props.handleToggle('showRunTime')}
                            type="checkbox"
                            checked={this.props.job.showRuntime} />
                          <label htmlFor="ts1" className="ts-helper"></label>
                          <label htmlFor="ts1" className="ts-label-right">Set a run Time</label>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-lg-1">
                        <p style={{
                          marginTop: '18px'
                        }} className={this.props.errors.runTime}>
                          <i className="fa fa-calendar"></i>
                        </p>
                      </div>
                      <div className="col-lg-11">
                        <Datetime className="form-control"
                          timeFormat={true}
                          value={this.props.job.run_time}
                          onChange={(event) => this.props.handleInputChange(event, 'run_time')}
                          inputProps={{ disabled: this.props.disabled.showRunTime }} />
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-lg-8">
                    <div className="card" style={{
                      minHeight: '300px'
                    }}>
                      <div className="card-header bgm-blue c-white">
                        <h4 style={{
                          color: 'white'
                        }}>Parameters</h4>
                      </div>
                      <div className="card-body card-padding">
                        {this.props.paramComponent}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="row">
                      <div className="col-lg-12">
                        <Inputs.Text value={this.props.newParam.key}
                          onChange={(event) => this.props.handleNewParam(event, 'key')}
                          placeholder="Enter key here" />
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-lg-4">
                        <label>Value Type:</label>
                      </div>
                      <div className="col-lg-8">
                        <select className="form-control" onChange={(event) => this.props.handleNewParam(event, 'type')} value={this.props.newParam.type}>
                          <option></option>
                          <option value="text">text</option>
                          <option value="number">number</option>
                          <option value="list">list</option>
                        </select>
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-lg-12">
                        <Inputs.Text value={this.props.newParam.value}
                          onChange={(event) => this.props.handleNewParam(event, 'value')}
                          placeholder="Enter value here" />
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-lg-12">
                        <Button
                          btnStyle="primary"
                          onClick={() => this.props.submitNewParam()}
                        >
                          Edit Parameter
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-header bgm-gray c-white">
                    <h4 style={{
                      color: 'white'
                    }}>Info</h4>
                  </div>
                  <div className="card-body card-padding">
                    <h4>Welcome to the Job Runner!</h4>
                    <p>
                      Here you can create or edit a job to run on the dedicated server. Jobs are meant either to populate the database with new information or to gather existing data. Jobs can be run at a particular time or on regular intervals.
                    </p>
                    <h4>What do you want to run?</h4>
                    <p>
                      Select an API for the job to execute using the drop-down menu at the top of the form. This is the only information required to create a job.
                    </p>
                    <div >
                      <h4>Should other job admins be able to monitor this job?</h4>
                      <p>
                        You can make your job accessible to other job admins by toggling the
                        <b>Set as an admin job</b>
                        checkbox.
                      </p>
                    </div>
                    <h4>Should this re-occur?</h4>
                    <p>
                      If you would like the scheduler to regularly rerun your job, you can have it do so by clicking the
                      <b>Set an interval</b>
                      checkbox and selecting the desired interval (e.g. daily, weekly, etc.). Edititionally, you can instruct the scheduler to skip a number of intervals between jobs. Scheduled jobs can be given a termination condition as well, which is either a fixed number of iterations or a certain date.
                    </p>
                    <h4>When should it start?</h4>
                    <p>
                      If you want the job to start running now, do not set a run time. However, if you wish to set the initial date and time for the job, or you would like to specify when a repeating job should be run, then click the
                      <b>Set a run time</b>
                      checkbox to the right of the interval form and set a date and time. Enter the desired local time in 24-hour format.
                    </p>
                    <h4>Does it require additional information?</h4>
                    <p>
                      If the job requires certain parameters, you can add them to the Parameters table, which shows all the parameters that will be passed to the job. If you need to edit a parameter, simply enter the key with the new value as if you were adding a new parameter.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Button
              btnStyle="primary"
              onClick={() => this.props.submitJob()}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
