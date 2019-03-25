import React, { Component } from 'react'
import { Inputs, Form, Collapse } from '~/components'

class JobDateTime extends Component {
  constructor(props) {
    super(props)
    this.weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
  }

  componentWillReceiveProps(nextProps) {
    this.setup(nextProps)
  }

  componentWillMount() {
    this.setup(this.props)
  }

  componentWillUpdate(nextProps) {
    this.setup(nextProps)
  }

  setup(props) {
    this.form = props.form
    this.onChange = form => props.onChange(form)
    this.error = props.error
    this.onSubmit = props.onSubmit
    this.weeksComponent = this.createWeeksList()
  }

  // this should only be created when the user wants to repeat every week
  createWeeksList() {
    return (
      <div>
        {this.weekdays.map(day => {
          return (
            <div key={day} className="animated fadeInDown">
              <div className="col-lg-1">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="checkbox">
                      <label>
                        <input
                          type="checkbox"
                          data-label={day}
                          defaultChecked={this.props.form[day] === 'on'}
                        />
                        <i className="input-helper" />
                      </label>
                    </div>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-lg-12">
                    <label className="control-label">
                      {day.slice(0, 3)}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  renderOccurenceField() {
    return (
      <div>
        <div className="col-lg-2">
          <label id="occurences">After</label>
        </div>
        <div className="col-lg-2">
          <input
            type="number"
            className="form-control"
            data-label="occurences"
            value={this.props.form.occurences}
          />
        </div>
        <div className="col-lg-2">
          <label id="occurences">Occurences</label>
        </div>
      </div>
    )
  }

  renderOndateField() {
    return (
      <div>
        <div className="col-lg-3">
          <label id="ondate">On</label>
        </div>
        <div className="col-lg-9">
          <div className="row">
            <div className="col-lg-1">
              <p
                style={{
                  paddingTop: '10px',
                }}
              >
                <i className="fa fa-calendar" />
              </p>
            </div>
            <div className="col-lg-11">
              <Inputs.DateTime
                className="form-control"
                timeFormat={true}
                value={this.props.form.ondate}
                data-label="ondate"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderWeeksField() {
    return (
      <div className="row" style={{ margin: '0px' }}>
        {this.weeksComponent}
      </div>
    )
  }
  render() {
    const form = this.props.form

    return (
      <Form {...this.props} name="DateTime">
        <div className="row">
          <div className="col-lg-12">
            <Inputs.Switch id="hasInterval" align="right">
              Set an interval
            </Inputs.Switch>
          </div>
        </div>
        <br />
        <Collapse collapsed={form.hasInterval} showOverflow={true}>
          <div type="body" style={{ marginBottom: '125px' }}>
            <div className="row" style={{ margin: '0px' }}>
              <div className="col-lg-3">
                <label id="repeatInterval">Repeats Every</label>
              </div>
            </div>
            <br />
            <div className="row" style={{ margin: '0px' }}>
              <div className="col-lg-2">
                <input
                  type="number"
                  className="form-control"
                  value={form.repeatInterval}
                  data-label="repeatInterval"
                />
              </div>
              <div className="col-lg-7">
                <Inputs.Select
                  value={form.repeatScale}
                  options={[
                    { value: 'hourly', label: 'Hours' },
                    { value: 'daily', label: 'Days' },
                    { value: 'weekly', label: 'Weeks' },
                    { value: 'monthly', label: 'Months' },
                    { value: 'yearly', label: 'Years' },
                  ]}
                  id="repeatScale"
                />
              </div>
            </div>
            <br />
            {form.repeatScale === 'weekly' ? this.renderWeeksField() : <div />}
            <br />
            <div className="row" style={{ margin: '0px' }}>
              <div className="col-lg-3">
                <label>Ends</label>
              </div>
              <div className="col-lg-6">
                <Inputs.Radio
                  name="occurence"
                  selectedValue={form.hasInterval ? form.occurence : ''}
                  itemRenderer={radio => {
                    return (
                      <div className="row">
                        <div className="col-lg-12">
                          {radio}
                        </div>
                      </div>
                    )
                  }}
                >
                  <Inputs.RadioButton
                    value="never"
                    label="Never"
                    id="occurence"
                  />
                  <Inputs.RadioButton
                    value="occurence"
                    label="After some occurence"
                    id="occurence"
                  />
                  <Inputs.RadioButton
                    value="ondate"
                    label="On a specific date"
                    id="occurence"
                  />
                </Inputs.Radio>
              </div>
              <div className="row" style={{ margin: '0px' }}>
                <div className="col-lg-3" />
                {form.occurence === 'occurence'
                  ? this.renderOccurenceField()
                  : <div />}
              </div>
            </div>
            {form.occurence === 'ondate' ? this.renderOndateField() : <div />}
            <br />
          </div>
        </Collapse>
      </Form>
    )
  }
}

export default JobDateTime
