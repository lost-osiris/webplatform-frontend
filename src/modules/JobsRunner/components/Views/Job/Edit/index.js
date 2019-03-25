import React, { Component } from 'react'
import Details from './Details'
import FormInfo from './Info'

class EditMainForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
    }
  }

  UNSAFE_componentWillMount() {
    this.form = this.props.form
  }

  // onChange(form, name) {
  // this.form[name] = e.target.value
  // this.forceUpdate()
  // }

  checkForm(form) {
    let errors = {
      name: true,
      description: true,
      api: true,
      occurences: true,
      occurence: true,
      ondate: true,
      repeatInterval: true,
      hasRunTime: true,
    }

    if (form.name != undefined && form.name != '') {
      errors.name = false
    }

    if (form.description != undefined && form.description != '') {
      errors.description = false
    }

    if (form.api != null) {
      errors.api = false
    }

    if (!form.hasRunTime) {
      errors.hasRunTime = false
    } else {
      if (form.runTime) {
        errors.hasRunTime = false
      }
    }

    if (form.hasInterval) {
      if (form.repeatInterval != undefined && form.repeatInterval > 0) {
        errors.repeatInterval = false
      }

      if (form.occurence !== undefined) {
        errors.occurence = false
        if (form.occurence === 'occurence') {
          if (form.occurences > 0) {
            errors.occurences = false
          }
        } else {
          errors.occurences = false
        }
      }
    } else {
      errors.repeatInterval = false
      errors.occurence = false
      errors.occurences = false
    }

    if (form.occurence === 'ondate') {
      errors.ondate = form.ondate === undefined || form.ondate === null
    } else {
      errors.ondate = false
    }

    return errors
  }

  onSubmit(form) {
    const errors = this.checkForm(form)
    // console.log(errors)
    // console.log(form)
    const errorCount = Object.keys(errors).reduce(
      (count, key) => (errors[key] ? count + 1 : count),
      0
    )

    if (errorCount === 0) {
      this.props.onSubmit(form)
    }

    return errors
  }

  render() {
    let { type, apis } = { ...this.props }

    return (
      <div className="animated fadeInRight">
        <div className="card">
          <CardHeader type={type} />
          <div className="card-body card-padding">
            <div className="row">
              <div className="row-height">
                <div className="col-lg-8 col-height">
                  <Details
                    form={this.form}
                    apis={apis}
                    onSubmit={form => this.onSubmit(form)}
                  />
                </div>
                <div className="col-lg-4 col-height">
                  <FormInfo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const CardHeader = ({ type }) => {
  if (type == 'edit') {
    return (
      <div className="card-header ch-alt">
        <h3>Edit job on the scheduler</h3>
      </div>
    )
  }

  return (
    <div className="card-header ch-alt">
      <h3>Add a new job to the scheduler</h3>
    </div>
  )
}

export default EditMainForm
