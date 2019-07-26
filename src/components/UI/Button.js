import React, {Component} from 'react'
import classnames from 'classnames'

/**
  Props:
    - btnStyle: one of ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark", "link"]
    - color
    - size: one of ["lg", "sm", "xs"]
    - disabled: renders disabled button if true
    - block: renders button that spans the full width of parent if true
    - round: renders a round button if true
    - icon: renders a icon button if true
    - float: renders a float icon if true
    - otherClasses: any extra class names that should be attached to the button
*/
class Button extends Component {
  constructor(props) {
    super(props)
  }

  saveRef = (ref) => this.containerNode = ref

  getButtonClass() {
    const {
      btnStyle,
      color,
      size,
      block,
      icon,
      otherClasses,
      raised,
      float,
      text,
      active,
    } = this.props

    const hasStyle = btnStyle !== undefined
    const hasColor = color !== undefined
    const hasRaised = raised !== undefined

    return classnames({
      btn: true,
      'active': active,
      'waves-circle': true,
      'btn--icon': icon && text == undefined,
      'waves-effect': true,
      'btn-default': !hasStyle && !hasColor,
      'btn-block': block === true,
      'btn--icon-text': icon && text,
      [`btn-${btnStyle}`]: !hasColor && hasStyle,
      [`btn-${size}`]: size !== undefined,
      'btn--raised': !(hasRaised && (!raised || raised == false)),
      [`bg-${color}`]: hasColor,
      'btn-float': float,
      'waves-float': float,
      [otherClasses]: otherClasses !== undefined,
    })
  }

  handleClick(event) {
    const {onClick} = this.props
    if (typeof onClick === 'function') {
      onClick(event)
    }
  }

  render() {
    const {disabled, style, type} = this.props

    //Ref to be used for locating button, primarily used in DropDown.js
    let ref = this.saveRef

    if (this.props.handleRef) {
      ref = this.props.handleRef
    }

    //Account for scaling icon when bigger button is used with "float"
    // let iconStyle = {'fontSize': 16.2}
    let iconStyle = {}
    if (this.props.float) {
      //Scale icon up for larger button
      // iconStyle.fontSize = 23

      //Ensure icon is centered in new larger buttons
      // this.props.style.display='flex'
      // this.props.style.justifyContent='center'
      // this.props.style.alignItems='center'
    }

    return (
      <button
        className={this.getButtonClass()}
        disabled={disabled ? 'disabled' : ''}
        onClick={(event) => this.handleClick(event)}
        style={style}
        type={type || 'button'}
        ref={ref}
      >
        {(this.props.icon && this.props.icon != true) &&
          <i className={this.props.icon} style={iconStyle} />
        }
        {this.props.children}
        {this.props.text}
      </button>
    )
  }

  static Group =  ({...props}) => {
    return <BtnGroup {...props} />
  }
}

class BtnGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: props.active
    }
  }

  onClick(index) {
    this.setState({active: index})
  }

  render() {
    let buttons = []

    for (let i in this.props.children) {
      let element = this.props.children[i]
      let { onClick } = element.props

      let handleClick = () => {
        this.onClick(i)

        if (onClick) {
          onClick()
        }
      }

      let active = () => {
        if (i == this.state.active) {
          return true
        }
        return false
      }

      let newProps = {
        key: i,
        active: active(),
        ...element.props
      }
      newProps.onClick = handleClick


      buttons.push(React.cloneElement(element, newProps))
    }

    return (
      <div className="btn-group">
        { buttons }
      </div>
    )
  }
}

export default Button
