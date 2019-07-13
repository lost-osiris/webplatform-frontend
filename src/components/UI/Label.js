import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

class Label extends Component {
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
    let className = classnames({
      'is-invalid': this.props.error,
    })

    return <label className={className}>{ this.props.children }</label>
  }
}

const mapStateToProps = (state, ownProps) => {
  let name = ownProps.form
  let id = ownProps.id
  let error = false

  if (name && id) {
    error = state.dashboard.form[name].errors[id]
  }

  return {error: error}
}

const LabelComponent = connect(mapStateToProps)(Label)
export default LabelComponent