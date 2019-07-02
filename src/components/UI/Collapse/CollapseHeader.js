import React, { Component } from 'react'

/**
 * The collapseHeader component is used for creating a clickable 
 * header that will function as a toggle for expanding and contracting
 * the collapse content associated with it.
 * 
 * The associated collapsible content is the CollapseBody component nested within the
 * CollapseItem component one level up (a sibling of this collapseHeader component).  
 */
export default class CollapseHeader extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    const titleProps = {
      // ...this.props,
      onClick: this.props.onClick,
      className: 'accordion__title'
    }

    // Determine which icon should be rendered ( '+' or '-')
    let icon = 'zmdi zmdi-hc-fw'
    this.props.collapsed ? icon += ' zmdi-plus' : icon += ' zmdi-minus'

    return (
      <div {...titleProps} >
        <i className={icon}></i>
        {this.props.children}
      </div>
    )
  }

}
