import React, { Component } from 'react'

export default class DragAndDrop extends Component {
  handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files.length > 0) {
      if (typeof this.props.onDrop === 'function') {
        this.props.onDrop(e.dataTransfer)
      }
    }
  }

  handleOnClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  render() {
    return (
      <div
        style={{ height: '100%', width: '100%', paddingTop: '20px' }}
        onDrop={e => this.handleDrop(e)}
        onDragEnter={e => e.preventDefault()}
        onDragOver={e => e.preventDefault()}
        onClick={e => this.handleOnClick(e)}
      >
        {this.props.children}
      </div>
    )
  }
}
