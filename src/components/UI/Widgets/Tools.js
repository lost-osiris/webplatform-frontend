import React, { Component } from 'react'

class Tools extends Component {
  constructor(props) {
    super(props)
    this.current = props.current

    this.show = 'show'
    this.hide = 'hide'
  }

  render() {
    var globalClass = this.hide
    var children = this.props.children.map((value) => {
      let component = null
      if (value.key == this.props.current) {
        globalClass = this.show
        component = value
      }

      if (component != null) {
        return React.cloneElement(value)
      }
    })

    return (
      <div className={ globalClass }>
        {children}
      </div>
    )
  }
}

export default Tools
