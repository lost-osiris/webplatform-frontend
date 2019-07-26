import React, {Component} from 'react'

import Header from './CollapseHeader'
import Body from './CollapseBody'

/**
 * The CollapseItem class is used for both assigning the correct classnames
 * to the outer container hosting the CollapseHeader and CollapseBody components,
 * as well as keeping track of the collapse item's state for showing and hiding
 * the content
 */
export default class CollapseItem extends Component {
  constructor(props) {
    super(props)

    this.HEADERTYPE = (<Header />).type
    this.BODYTYPE = (<Body />).type

    if (props.collapsed !== undefined) {
      this.state = {
        collapsed: props.collapsed
      }
    }
    else {
      // Use component state to keep track of the specific "CollapseItem's" collapsed status
      this.state = {
        collapsed: true
      }
    }

  }

  componentDidUpdate() {
    if (this.props.collapsed !== undefined && this.props.collapsed !== this.state.collapsed) {
      this.setState({collapsed: this.props.collapsed})
    }
  }

  // Simply invert the current state, effectivley toggling it
  toggle = () => {
    this.setState({collapsed: !this.state.collapsed})
  }

  /**
   * A middle-man to the render method.
   * Will insert an on click and handle state managment (if collapse is toggled or not)
   * by adding in props that are scoped to this class
   * 
   * @param {*} children children to render
   */
  renderChildren(children) {

    // Check if only one child is present, will be an array if multiple children are present
    if (!Array.isArray(children)) {
      let child = children

      if (child.type === this.BODYTYPE) {
        let newBodyProps = {
          ...child.props,
          collapsed: this.state.collapsed
        }
        return React.cloneElement(child, newBodyProps, child.props.children) 
      }
      else {
        // One child was specified, but it wasnt a collapse body, this should never be the case
        return <h3 className="text-danger">MISFORMATTED CHILDREN ON COLLAPSE</h3>
      }
    }

    // Otherwise, loop though children and render accordingly
    return children.map((child, index) => {

      // New element to be returned based off of child
      let newElement = null

      if (child.type === this.HEADERTYPE){

        const header = child

        // Append an onClick for toggling the collapse, collapsed prop, as well as a key to existing component props
        const newHeaderProps = {
          ...header.props, 
          key: index, 
          collapsed: this.state.collapsed,
          onClick: () => this.toggle()
        }

        // Clone the new element and return it to be rendered
        newElement = React.cloneElement(header, newHeaderProps, header.props.children)

      }

      else if (child.type === this.BODYTYPE){
        const body = child

        // Append a collapsed prop for rendering collapse state as well as a key to existing component props
        const newBodyProps = {
          ...body.props,
          key: index,
          collapsed: this.state.collapsed
        }

        // Clone the new element and return it to be rendered
        newElement = React.cloneElement(body, newBodyProps, body.props.children)
      }

      return newElement

    })
  }

  render() {
    return (
      <div className="accordion__item">
        {this.renderChildren(this.props.children)}
      </div>
    )
  }

}
