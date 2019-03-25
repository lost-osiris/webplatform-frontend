import React, { Component } from 'react'
// import classnames from 'classnames'

/**
  Props:
    - checked: Whether input is checked
    - inline: Whether checkboxes should be displayed inline
    - label: string
    - onChange: function
    - margin: number
*/
class Check extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: this.props.checked || false,
    }
  }

  componentDidMount() {
    this.setState({checked: this.props.checked || false})
  }

  toggle() {
    this.state.checked ? this.setState({checked: false}) : this.setState({checked: true})
  }

  handleChange(e) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e.target.dataset.checked === 'true')
    }

    this.toggle()
  }

  render() {
    // console.log(this.props.checked)
    // const checkboxClass = classnames({
    //   checkbox: true,
    //   'checkbox-inline': this.props.inline,
    //   'm-b-15': !this.props.margin,
    //   [`m-b-${this.props.margin}`]: !isNaN(this.props.margin),
    // })

    let className = 'checkbox'
    if ( this.props.inline) {
      className += ' checkbox--inline'
    }

    return (
      <div className={className}>
        <input type="checkbox" />
        <label className="checkbox__label"
          data-checked={this.state.checked}
          onClick={(e) => this.handleChange(e)}
          style={this.props.style}>
          {this.props.label}
        </label>
      </div>
    )
  }
}

export default Check
