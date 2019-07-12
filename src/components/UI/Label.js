import React, { Component } from 'react'

export default class Form extends Component {
  constructor(props) {
    super(props)

    this.state = {
      form: props.form,
    }
  }

  componentDidMount() {
    let newState = {
      name: this.props.name
    }

    this.setState(newState)
  }

  render() {
    return <label>{ this.props.children }</label>
  }
}