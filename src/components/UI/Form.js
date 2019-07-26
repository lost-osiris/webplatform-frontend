
import React, { Component } from 'react'
import Utils from '~/utils'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class FormContainer extends Component {
  constructor(props) {
    super(props)

    this.utils = new Utils()

    this.state = {
      errors: props.errors,
      form: props.form,
      name: props.name,
      setup: false, 
      init: true,
    }
  }

  componentWillUnmount() {
    this.utils.dispatch('FORM_CLEAR', {name: this.props.name})
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.setup) {
      return true
    }

    return false
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

  componentDidUpdate(prevProps) {
    let compare = this.compareForm(prevProps.form, this.props.form)
    if (compare && this.props.onChange) {
      this.props.onChange(this.props.form)
    }
  }

  compareForm(prevForm, nextForm) {
    let found = false
    let keys = Object.keys(prevForm)
    
    keys.forEach((key) => {
      if (prevForm[key] !== nextForm[key]) {
        found = true
      }
    })

    return found
  }

  handleSubmit(e) {
    e.preventDefault()

    if (this.props.onSubmit) {
      let form = {...this.props.form}
      delete form.errors

      let errors = this.props.onSubmit(form)

      let hasErrors = this.checkErrors(errors)
     
      if (hasErrors) {
        let action = {
          name: this.props.name,
          errors: errors
        }

        this.utils.dispatch('FORM_ERROR', action)
      } else {
        this.utils.dispatch('FORM_CLEAR', {name: this.props.name})
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
        <form onSubmit={(e) => this.handleSubmit(e)} form={this.props.form}>
          { this.props.children }
        </form>
      )
    } else {
      return <span />
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  let name = ownProps.name || state.dashboard.form.counter
  let form = state.dashboard.form[name] || ownProps.form
  
  return {form: {...form}, name: name}
}

FormContainer.propTypes = {
  form: PropTypes.object,     // Object containing inital values for Input components
  name: PropTypes.string,     // Name of the form used to set inital state of inputes in Global state
}

const Form = connect(mapStateToProps)(FormContainer)

export default Form

