import React, {Component} from 'react'

import CollapseBody from './CollapseBody'

export default class Collapse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: props.collapsed
    }
  }

  toggle() {
    console.log('toggling')
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {

    let props = {
      key: 'collapse-body',
      collapsed: this.props.collapsed,
      showOverflow: this.props.showOverflow,
      height: this.props.height,
    }

    return (
      <CollapseBody {...props}>
        {this.props.children}
      </CollapseBody>
    )
    
  }
}
