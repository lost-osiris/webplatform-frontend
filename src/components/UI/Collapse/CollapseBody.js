import React, { Component } from 'react'

/**
 * The collapseBody component is used for rendering the collapse content. This component
 * is shown and hidden by interacting/clicking the associated CollapseHeader component.
 * 
 * The associated CollapseHeader component is the CollapseHeader component nested within the
 * CollapseItem component one level up (a sibling of this collapseBody component).  
 */
export default class CollapseBody extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    // Set the default class name which is always present
    let classes = 'collapse' 

    // If the component is NOT collapsed, it should be showing
    if (!this.props.collapsed) {
      classes += ' show'
    }

    const bodyProps = {
      className: classes
    }

    return (
      <div {...bodyProps} >
        <div className='accordion__content'>
          {this.props.children}
        </div>
      </div>
    )
  }

}
