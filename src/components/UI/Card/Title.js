import React, { Component } from 'react'
import classnames from 'classnames'

export default class CardTitle extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { children, className, ...rest } = this.props
    const headerClass = classnames({
      'card-title': true,
      [className]: className !== undefined
    })

    return (
      <div className={headerClass} {...rest}>
        {children}
      </div>
    )
  }
}
