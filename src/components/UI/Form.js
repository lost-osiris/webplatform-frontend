
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

  render() {
    if (this.state.setup) {
      return this.props.children
    } else {
      return <span />
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  let name = ownProps.name || state.dashboard.form.counter
  let form = ownProps.form || state.dashboard.form[name]

  return {form: form, name: name}
}

const FormComponent = connect(mapStateToProps)(Form)
export default Form

