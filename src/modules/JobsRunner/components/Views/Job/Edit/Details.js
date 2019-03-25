import React from 'react'
import { Button, Inputs, Form } from '~/components'

import IntervalDateTime from './DateTime'
import Params from './Params'

class Details extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: props.form,
      params: {},
      error: props.error,
    }
  }

  componentWillMount() {
    this.setup(this.props)
  }

  componentDidMount() {
    // in case the autocomplete field
    // has been set when editing the job
    this.setState({
      apiMatch: this.refs.api.isExact(),
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.form !== this.state.form) {
      this.setState({ form: nextState.form })
    }

    this.setup(nextProps)
  }

  setup(props) {
    this.form = props.form
    this.apis = props.apis
    this.onSubmit = props.onSubmit
    this.error = props.error

    this.handleAutocomplete = result => {
      let apiMatch = false
      if (result.exact) {
        apiMatch = true
      } else {
        apiMatch = false
      }

      this.form.api = result.searchText
      this.setState({ apiMatch: apiMatch })
    }

    // overriding passed in onSubmit prop
    // onSubmit has to return a list of errors within the form
    this.handleSubmit = currentForm => {
      let newForm = { ...currentForm }

      if (!this.state.apiMatch) {
        newForm.api = null
      }

      this.error = this.onSubmit(newForm)
      this.setState({ error: this.error })
      return this.error
    }
  }

  handleChange(form) {
    this.setState({ form: form })
    // this.forceUpdate()
  }

  handleParamsChange(params) {
    this.form.params = params
    this.setState({ form: { ...this.form } })
  }

  renderDatetimeForm() {
    return (
      <div className="col-lg-7">
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
          <div className="col-lg-10">
            <Inputs.DateTime
              className="form-control"
              timeFormat={true}
              value={this.form.runTime}
              data-label="runTime"
            />
          </div>
        </div>
      </div>
    )
  }

  render() {
    let props = {
      onChange: (form, name) => this.handleChange(form, name),
      onSubmit: this.handleSubmit,
      form: this.state.form,
      error: this.state.error,
      name: 'Details',
    }

    return (
      <Form {...props}>
        <div>
          <div className="row">
            <div className="col-lg-12">
              <label id="api">Choose an API</label>
              <Inputs.Autocomplete
                ref="api"
                placeholder={'Search by module name'}
                minSearch={1}
                data={this.apis}
                onChange={this.handleAutocomplete}
                isObject={true}
                searchText={this.form.api}
                data-label="api"
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-3">
                  <label id="name">Name <sup>*</sup></label>
                </div>
                <div className="col-lg-9">
                  <Inputs.Text placeholder="Enter name here" data-label="name" />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-lg-12">
                  <Inputs.Switch align="right" id="isAdmin">
                    Set as an admin job
                  </Inputs.Switch>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-3">
                  <label id="description">Description <sup>*</sup></label>
                </div>
                <div className="col-lg-9">
                  <Inputs.Text
                    type="textarea"
                    rows="5"
                    data-label="description"
                    placeholder="Enter name here"
                  />
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-12">
                  <IntervalDateTime {...props} />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-5">
                  <Inputs.Switch align="right" id="hasRunTime">
                    Set a run Time
                  </Inputs.Switch>
                </div>
                {this.form.hasRunTime ? this.renderDatetimeForm() : <div></div>}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="row">
            <div className="col-lg-12">
              <Params
                params={this.form.params || {}}
                onChange={params => this.handleParamsChange(params)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <Button
                btnStyle="warning"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Form>
    )
  }
}

export default Details
