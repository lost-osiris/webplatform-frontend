import React, {Component} from 'react'
import classnames from 'classnames'

export class TabsNav extends Component {
  constructor(props) {
    super(props)
  }

  buildNav(children) {
    // console.log(children)
    if (children instanceof Array) {
      return children.map((item) => {
        return this.renderSingleNav(item)
      })
    } else {
      if (children.render) {
        return React.cloneElement(children)
      }

      return React.cloneElement(children, {render: (item) => this.renderSingleNav(item)})
    }

  }

  renderSingleNav(item) {
    let onClick
    if (item.props && item.props.onClick != undefined) {
      onClick = () => {
        this.props.handleClick(item.props.target)
        item.props.onClick()
      }
    } else {
      onClick = () => {
        this.props.handleClick(item.props.target)
      }
    }

    var props = {
      onClick: onClick,
      className: classnames({
        'nav-link': true,
        active: item.props.target == this.props.current,
        show: item.props.target == this.props.current,
      })
    }

    var element = React.cloneElement(item, props)

    return (
      <li className="nav-item" key={item.props.target}>
        {element}
      </li>
    )
  }

  render() {
    // console.log('tabs nav', this.props)
    let type = this.props.fill ? 'nav nav-tabs nav-fill' : 'nav nav-tabs'

    if (this.props.color != undefined) {
      type += ' nav-tabs--' + this.props.color
    }

    let nav = this.buildNav(this.props.children)

    return (
      <ul className={type} data-tab-color={this.props.color}>
        {nav}
      </ul>
    )
  }
}
