import React, { Component } from 'react'
import classnames from 'classnames'

import Title from './Title'
import Body from './Body'
import Footer from './Footer'
import SideNav from './SideNav'

class Card extends Component {
  constructor(props) {
    super(props)

    this.SIDENAVTYPE = <SideNav />.type
    this.FOOTERTYPE = <Footer />.type
    this.BODYTYPE = <Body />.type
    this.TITLETYPE = <Title />.type
  }

  renderChildren(children) {
    const navs = children.filter(child => child.type === this.SIDENAVTYPE)
    const nav = navs.length > 0 ? navs[0] : undefined

    return children.filter(child => child.type !== this.SIDENAVTYPE).map(child => {
      const { children, ...rest } = child.props

      let element
      if (child.type === this.BODYTYPE) {
        let SideNav = () => nav

        if (!nav) {
          SideNav = nav
        }

        element = React.cloneElement(child, { SideNav, ...rest }, children)
      } else {
        element = React.cloneElement(child, { ...rest, }, children)
      }

      return element
    })
  }

  render() {
    const { children, className, ...rest } = this.props
    const cardClass = classnames({
      card: true,
      [className]: className !== undefined,
    })

    return (
      <div className={cardClass} {...rest}>
        {this.renderChildren(React.Children.toArray(children))}
      </div>
    )
  }
}

Card.Title = Title
Card.Body = Body
Card.Footer = Footer
Card.SideNav = SideNav

export default Card
