import React, { Component } from 'react'

export default class Json extends Component {
  constructor(props) {
    super(props)
    this.data = props.data
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.data = nextProps.data
  }

  replacer(key, val) {
    return (typeof val === 'function') ? '[function]' : val
  }

  render() {
    return (
      <pre>{JSON.stringify(this.data, this.replacer, 2)}</pre>
    )
  }
}
