import React, {Component} from 'react'

import Item from './CollapseItem'
import Header from './CollapseHeader'
import Body from './CollapseBody'

/**
 * The collapse component is responsible for rendering the accordian
 * style collapse that is composed of 3 parts.
 * 
 * Collapse Item - A component "wrapper" of sorts, holding the CollapseItem and CollapseBody. This component
 *                 also manages the state of it's particular collapsible section.
 * Collapse Header - The clickable header component of the collapse.
 * Collapse Body - The component used to render the body (ie what is shown when the collapse is expanded).
 */
class Collapse extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <div className="accordion">
        {this.props.children}
      </div>
    )
  }

}

Collapse.Item = Item
Collapse.Header = Header
Collapse.Body = Body

export default Collapse