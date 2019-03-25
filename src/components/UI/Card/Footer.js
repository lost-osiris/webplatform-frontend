import React, { Component } from 'react'
import classnames from 'classnames'

export default class CardFooter extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { children, className, ...rest } = this.props
    const footerClass = classnames({
      'card-footer': true,
      [className]: className !== undefined
    })

    return (
      <div className={footerClass} {...rest}>
        {children}
      </div>
    )
  }
}
