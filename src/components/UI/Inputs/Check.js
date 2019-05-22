import React, { Component } from 'react'

/**
  Props:
    - checked: Whether input is checked
    - inline: Whether checkboxes should be displayed inline
    - label: string
    - onChange: function
*/
class Check extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: this.props.checked || false,
    }
  }

  componentDidUpdate() {
    if (this.props.checked != this.state.checked) {
      this.setState({checked: this.props.checked})
      return true
    }

    return false
    
  }

  componentDidMount() {
    this.setState({checked: this.props.checked || false})
  }

  toggle() {
    this.setState({checked: !this.state.checked})
  }

  handleChange() {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(!this.state.checked)
    }

    this.toggle()
  }

  render() {

    let className = 'checkbox'
    if ( this.props.inline) {
      className += ' checkbox--inline'
    }

    return (
      <div className={className}>
        <input type="checkbox" />
        <label className="checkbox__label"
          // data-checked={this.state.checked}
          data-checked={this.props.checked}
          onClick={(e) => this.handleChange(e)}
          style={this.props.style}>
          {this.props.label}
        </label>
      </div>
    )
  }
}

export default Check
