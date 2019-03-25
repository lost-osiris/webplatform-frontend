import React, { Component } from 'react'
import classnames from 'classnames'

export class TabsContent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      current: props.current,
      show: true,
    }
  }

  componentDidMount() {
    this.setState({current: this.props.current})
  }

  componentDidUpdate(prevProps) {
    if (this.state.current != this.props.current && this.state.show) {
      this.setState({show: false, prev: prevProps.current})

      setTimeout(() => this.setState({
        current: this.props.current,
        prev: undefined,
        show: true,
      }), 50)
    }
  }

  Content({props}) {
    return props.children
  }

  renderChildren({children, current, prev}) {
    if (!(children instanceof Array)) {
      return children
    }
    
    let output = []
    for (let i in children) {
      let child = children[i]
      let className

      if (!child) {
        continue
      }

      if (child.key === current) {
        className = classnames({
          animated: true,
          fadeIn: true,
          fadeOut: false,
        })
      } else if (child.key === prev) {
        className = classnames({
          animated: true,
          fadeIn: false,
          fadeOut: true,
        })
      } else {
        className = classnames({
          hide: true,
        })
      }

      let newProps = {
        className: className,
        key: i,
        ...child.props,
      }

      output.push(React.cloneElement(child, newProps))
    }

    return output
  }

  render() {
    let Content = this.renderChildren

    return (
      <div className="tab-content" style={ this.props.contentStyle }>
        <Content {...this.state}>
          { this.props.children }
        </Content>
      </div>
    )
  }
}
