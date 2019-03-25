import React, { Component } from 'react'

export default class CollapseHeader extends Component {
  constructor(props) {
    super(props)
    this.collapsed = props.collapsed
    this.toggle = props.toggle
  }

  render() {
    return (
      <div
        className={
          this.props.collapsed == false ? 'panel-heading': 'panel-heading active'
        }
        role="tab"
        onClick={() => this.toggle()}>
        <h4 className="panel-title">
          <a>
            { this.props.children }
          </a>
        </h4>
      </div>
    )
  }
}
