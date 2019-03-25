import React, { Component } from 'react'
import { Button } from '~/components'

export default class DropDown extends Component {
  constructor(props) {
    super(props)
    this.buttonRef = React.createRef()
    this.state = {
      open: '',
    }

    this.icon = props.icon || ''
    this.color = props.color
    this.float = props.float != undefined
    this.style = {}
    this.direction = props.direction || 'down'

    if (props.style != undefined) {
      this.style = props.style
    }

  }

  static Item({className, children, ...rest}) {
    if (className) {
      className += ' dropdown-item'
    } else {
      className = 'dropdown-item'
    }

    return <a className={className} {...rest}>{ children }</a>
  }

  calculateOffset(node) {
    if (node && !this.state.x && !this.state.y) {
      this.setState({
        x: node.clientWidth,
        y: node.clientHeight,
      })
    }
  }

  toggleOpen() {
    if (this.state.open == '') {
      this.setState({
        open: 'open',
      })
    } else {
      this.setState({
        open: ''
      })
    }
  }

  handleBlur() {
    this.setState({
      open: ''
    })
  }

  componentWillUnmount() {
    this.setState({})
  }

  render() {
    let style = {}
    if (this.props.alt != undefined) {
      style.backgroundColor = 'transparent'
    }

    let props = {
      icon: this.props.icon,
      color: this.color,
      float: this.float,
      round: this.props.round,
      size: this.props.size,
      style: style,
      onClick: () => this.toggleOpen(),
      children: this.props.children,
    }

    let dropDownClassName = 'drop' + this.direction

    if (this.state.open === 'open') {
      dropDownClassName += ' open'
    }

    let position = {
      x: this.state.y,
      y: this.state.x
    }

    let offset = 0
    if (this.props.offset) {
      offset = this.props.offset
    }

    return (
      <div className={dropDownClassName} onBlur={ () => this.handleBlur() }>
        <DropDownButton {...props} handleRef={(e) => this.calculateOffset(e)} />
        <DropDownMenu direction={this.props.direction} offset={offset} style={this.props.style}
          open={this.state.open}
          position={position}>
          { this.props.children }
        </DropDownMenu>
      </div>
    )
  }
}


const DropDownMenu = ({...props}) => {
  let BUTTONTYPE = <Button />.type

  if (!(props.children instanceof Array)) {
    props.children = [props.children]
  }

  //Filter through and create collection of non-button children
  let menu = props.children.filter((child) => {
    if (BUTTONTYPE != child.type) {
      return child
    }
  })

  let position = props.position
  let style = {...props.style}

  // Correction for dropdown directions (up, right, down, left)
  // Also allows for the specification of an offset
  if (position.x && position.y) {
    if (props.direction == 'left') {
      let x = position.x + props.offset + 134
      style.position = 'absolute'
      style.right = 'auto'
      style.left = 0
      style.transform = `translate3d(-${x}px, 0px, 0px)`
    }

    else if (props.direction == 'right') {
      let x = 2 * position.x + props.offset + 34
      style.position = 'absolute'
      style.left = 0
      style.transform = `translate3d(${x}px, 0px, 0px)`
    }

    else if (props.direction == 'up') {
      let x = (2 * position.y) - props.offset - 24
      style.position = 'absolute'
      style.left = 0
      style.transform = `translate3d(0px, ${x}px, 0px)`
    }

    else {
      style.position = 'absolute'
      style.left = 0
      style.transform = `translate3d(0px, ${0 + props.offset}px, 0px)`
    }

  }

  //Return menu with custom styling from above
  return (
    <div className={'dropdown-menu' + (props.open === 'open' ? ' show' : '')}
      x-placement={props.direction}
      style={style}>
      { menu }
    </div>
  )
}

const DropDownButton = ({...props}) => {
  let { children, onClick, ...rest} = props

  let BUTTONTYPE = <Button />.type

  if (!(children instanceof Array)) {
    children = [children]
  }

  //Create a collection of buttons from DropDown's children
  let button = children.filter((child) => {
    if (BUTTONTYPE == child.type) {
      return child
    }
  })

  /*
  If buttons were found in the children, use the first button
  and its props to create a dropdown button
  */
  if (button.length > 0) {
    let newProps = {onClick, ...rest}
    let ChildButton = button[0]

    //Respect the child button's onClick and then handle the default onClick
    for (let i in ChildButton.props) {
      if (i == 'onClick') {
        newProps[i] = (e) => {
          new Promise((resolve) => {
            resolve(ChildButton.props[i](e))
          }).then((data) => onClick(data))
        }
      } else if (i == 'btnStyle') {
        if (newProps.color) {
          delete newProps.color
        }

        newProps[i] = ChildButton.props[i]
      } else {
        newProps[i] = ChildButton.props[i]
      }
    }

    return React.cloneElement(ChildButton, newProps)
  }
  //Button not found within children
  else {
    return (
      <Button onClick={onClick} {...rest} />
    )
  }
}
