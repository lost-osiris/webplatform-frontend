import React, { Component } from 'react'
import classnames from 'classnames'

export default class Loading extends Component {
  constructor(props) {
    super(props)
    this.opacity = 1
    this.toggle = props.toggle
    if (props.toggle == undefined) {
      this.toggle = true
    }
  }

  UNSAFE_componentWillMount() {
    if (this.props.opacity != undefined) {
      this.opacity = this.props.opacity
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.toggle == undefined) {
      this.toggle = true
    } else {
      this.toggle = nextProps.toggle
    }

    if (nextProps.opacity != undefined) {
      this.opacity = nextProps.opacity
    }
  }

  render() {
    let style
    // console.log(this.props)
    var classes = classnames({
      'show': this.props.toggle,
      'hide': !this.props.toggle,
      'page-loader': true,
    })

    let message = 'Processing...'
    if (this.props.message != undefined) {
      message = this.props.message
    }

    if (this.props.style != undefined) {
      style = {
        ...this.props.style
      }
    }

    if (this.props.className) {
      classes += ' ' + this.props.className
    }

    return (
      <div className={ classes } style={ style }>
        <div className="page-loader__spinner">
          <svg viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
          </svg>
        </div>
        <p className="page-loader__message">{ message }</p>
      </div>
    )
  }
}
