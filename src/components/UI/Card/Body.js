import React, { Component } from 'react'
import classnames from 'classnames'
import { Scrollbars } from 'react-custom-scrollbars'

class CardBody extends Component {
  constructor(props) {
    super(props)
  }

  renderChildren({ SideNav, children }) {
    if (SideNav === undefined) {
      return children
    }

    return [
      <SideNav key={0} />,
      <div key={1} className="card-body-content clearfix">
        { children }
      </div>
    ]
  }

  renderSideNav({ navScrollbar, navScrollbarProps, sideNav, sideNavProps }) {
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
        <div className="pm-overview" {...sideNavProps}>
          {sideNav}
        </div>
      )
    }
  }

  render() {
    const { children, SideNav, className, ...rest } = this.props

    const bodyClass = classnames({
      'card-body': true,
      'p-0': SideNav,
      'card-body-flex': SideNav,
      [className]: className !== undefined
    })

    return (
      <div className={bodyClass} {...rest}>
        {this.renderChildren({ children, SideNav })}
      </div>
    )
  }
}

export default CardBody
