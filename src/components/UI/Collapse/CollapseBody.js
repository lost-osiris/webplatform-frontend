import React, { Component } from 'react'
import classnames from 'classnames'

export default class CollapseBody extends Component {
  constructor(props) {
    super(props)
    this.state = {
      maxHeight: null,
    }
  }

  getHeight(element) {
    if (this.props.height !== undefined && this.state.maxHeight == null) {
      this.setState({maxHeight: this.props.height})
    } else if (element != null && this.state.maxHeight == null) {
      let height = element.offsetHeight
      this.setState({maxHeight: height})
    }
  }

  getStyle() {
    let style = {}
    if (this.state.maxHeight != null) {
      if (!this.props.collapsed) {
        style.maxHeight = this.state.maxHeight + 'px'
        style.overflow = this.props.showOverflow ? 'visible' : ''
      } else {
        style.maxHeight = '0px'
      }
    }
    return style
  }

  render() {
    let className = classnames({
      'collapse': true,
      //Show is set to always true to render element. Appearance of element is
      //done by setting height from 0 to x, bypassing the use of the "show" class
      'show': true,
      // 'closed' : this.props.collapsed,
    })
    return (
      <div className={className}
        style={this.getStyle()}
        ref={ (element) => {this.getHeight(element)} }
      >
        { this.props.children }
      </div>
    )
  }
}
