import React, { Component } from 'react'

/**
  Props:
    - options: array of { label, value } objects TODO: label should default to value
    - children: array of option inputs used if options not specified
    - value: currently selected value
    - id: form id
    - onChange
*/
class Select extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.props.value || '',
    }
  }

  renderOptions() {
    if (this.props.placeholder) {
      if (this.props.options === undefined) {
        return [
          <option key="select-default-option" value="">{ this.props.placeholder }</option>,
          this.props.children,
        ]

      } else {
        this.props.options.splice(0, 0, {label: this.props.placeholder, value: ''})
      }
    }

    if (this.props.options === undefined) {
      return this.props.children
    }

    return this.props.options.map(option => {
      return (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      )
    })
  }

  handleChange(e) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e.target.value)
    }

    this.setState({value: e.target.value})
  }

  componentDidMount() {
    this.setState({value: this.props.value || ''})
  }

  render() {
    let className = 'form-control'

    if (this.props.size && (this.props.size == 'sm' || this.props.size == 'lg')) {
      className += ' form-control-' + this.props.size
    }

    return (
      <div className="form-group">
        <div className="select">
          <select
            className={className}
            value={this.state.value}
            onChange={(e) => this.handleChange(e)}
            id={this.props.id}
          >
            {this.renderOptions()}
          </select>
        </div>
      </div>
    )
  }
}

export default Select
