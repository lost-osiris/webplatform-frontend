
import React, { Component } from 'react'
import { Inputs } from '~/components'
import Utils from '~/utils'
import { connect } from 'react-redux'

class Form extends Component {
  constructor(props) {
    super(props)

    this.utils = new Utils()

    this.state = {
      errors: props.errors,
      form: props.form,
      name: props.name,
      setup: false
    }
  }

  componentDidMount() {
    let action = {
      form: this.props.form,
      name: this.props.name
    }

    this.utils.dispatch('FORM_INIT', action).then(() => {
      this.setState({setup: true})
    })
  }

  handleSubmit(e) {
    e.preventDefault()

    if (this.props.onSubmit) {
      let errors = this.props.onSubmit(this.props.form)
      console.log(errors)

      let hasErrors = this.checkErrors(errors)
     
      if (hasErrors) {
        let action = {
          name: this.props.name,
          errors: errors
        }

        this.utils.dispatch('FORM_ERROR', action)
      }
    }
  }

  /**
   * Checks the specified array for errors and returns back an
   * object containing the form areas with errors
   * 
   * @param {array} errors - Array of errors for the component
   */
  checkErrors(errors) {
    let output = {}
    let found = false
    for (let i in errors) {
      if (errors[i]) {
        output[i] = errors[i]
        found = true
      }
    }

    if (found) {
      return output
    }

    return false
  }

  render() {
    if (this.state.setup) {
      return (
        <form onSubmit={(e) => this.handleSubmit(e)}>
          { this.props.children }
        </form>
      )
      return this.props.children
    } else {
      return <span />
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  let name = ownProps.name || state.dashboard.form.counter
  let form = ownProps.form || state.dashboard.form[name]
  let errors = ownProps.errors || form.errors

  return {form: form, name: name, errors: errors}
}

const FormComponent = connect(mapStateToProps)(Form)
export default Form

