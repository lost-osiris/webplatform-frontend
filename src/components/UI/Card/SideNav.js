import React, { Component } from 'react'
import classnames from 'classnames'
import { Scrollbars } from 'react-custom-scrollbars'

export default class CardSideNav extends Component {
  constructor(props) {
    super(props)
  }

  renderChildren({ children }) {
    let elements

    if (children.map) {
      elements = children.map((child, index) => {
        console.log(child)
        const { className } = child
        const childClass = classnames({
          'pmo-block': true,
          [className]: className !== undefined
        })
        return (
          <div className={childClass} key={index}>
            { child }
          </div>
        )
      })
    } else {
      const { className } = children
      const childClass = classnames({
        'pmo-block': true,
        [className]: className !== undefined
      })

      elements = (
        <div className={childClass}>
          { children }
        </div>
      )
    }

    return (
      // <Scrollbars style={ {left: 0, position: 'absolute', width: '300px', background: '#f8f8f8'} } autoHide>
      <Scrollbars style={{background: '#f8f8f8'}} autoHide>
        { elements }
      </Scrollbars>
    )
  }

  renderSideNav({ navScrollbar, navScrollbarProps, sideNav, sideNavProps }) {
    console.log(navScrollbar)
    if (navScrollbar) {
      return (
        <Scrollbars {...navScrollbarProps} autoHide>
          <div className="pm-overview" {...sideNavProps}>
            {sideNav}
          </div>
        </Scrollbars>
      )
    } else {
      return (
        <Scrollbars style={ {left: 0, position: 'absolute', width: '300px', background: '#f8f8f8'} } autoHide>
          <div className="pm-overview" {...sideNavProps}>
            {sideNav}
          </div>
        </Scrollbars>
      )
    }
  }

  render() {
    const { children, className, ...rest } = this.props

    const bodyClass = classnames({
      'card-nav': true,
      [className]: className !== undefined
    })

    return (
      <div className={bodyClass} {...rest}>
        { this.renderChildren({ children }) }
      </div>
    )
  }
}
