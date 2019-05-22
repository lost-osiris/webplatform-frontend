import React, {Component} from 'react'

import { TabsNav } from './TabsNav'
import { TabsContent } from './TabsContent'

export default class Tabs extends Component {
  constructor(props) {
    super(props)

    this.state = {
      current: this.props.current
    }

    this.CONTENTTYPE = (<TabsContent />).type
    this.NAVTYPE = (<TabsNav />).type
  }

  componentDidMount() {
    this.setState({current: this.props.current})
  }

  handleClick(tab) {
    if (this.props.onChange !== undefined) {
      this.props.onChange(tab)
    }

    this.setState({current: tab})
  }

  render() {
    let nav = this.props.children.filter(e => e.type === this.NAVTYPE)[0]
    let content = this.props.children.filter(e => e.type === this.CONTENTTYPE)[0]

    let { navChildren } = nav.props
    let navProps = {
      handleClick: (tab) => this.handleClick(tab),
      current: this.state.current,
      children: nav.props.children,
      ...nav.props
    }

    let { contentChildren } = content.props
    let contentProps = {
      current: this.state.current,
      children: contentChildren,
      ...content.props
    }

    return (
      <div className="tab-container">
        <TabsNav {...navProps} />
        <TabsContent {...contentProps} />
      </div>
    )
  }
}

Tabs.Nav = TabsNav
Tabs.Content = TabsContent
