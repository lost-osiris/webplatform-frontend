
import React, { Component } from 'react'
import { Inputs } from '~/components'
import Utils from '~/utils'

export default class Form extends Component {
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
    let stateObject = this.utils.getState()

    if (this.state.setup) {
      return this.props.children
    } else {
      return <p />
    }
  }
}