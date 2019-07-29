import React, { Component } from 'react'
import { Link } from '~/components'

import Utils from '~/utils'

export default class NavSubMenu extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()

    this.stateObj = {
      toggled: false,
    }

    this.className = 'navigation__sub'

    this.isProfile = false
    if (props.isProfile != undefined) {
      this.className += ' user__menu'
      this.isProfile = props.isProfile
    }

    this.title = props.title

    if (props.icon != undefined) {
      this.icons = props.icon
    } else {
      this.icons = {}
    }
    this.user = props.user
  }

  onClick() {
    if (this.stateObj.toggled) {
      this.stateObj.toggled = false
    } else {
      this.stateObj.toggled = true
    }
    this.forceUpdate()
  }

  isToggled() {
    let check = this.stateObj.toggled
    if (check) {
      return this.className + ' toggled'
    } else {
      return this.className
    }
  }

  getStyle() {
    var nodes = 1
    if (this.props.children == undefined) {
      nodes = 2
    } else if (this.props.children != undefined && this.props.children.length != undefined) {
      nodes = this.props.children.length
    }

    let height = 0
    if (this.stateObj.toggled) {
      // given heights from less you could find the actual height number of nodes from children
      // heights are padding and a base height.
      height = 40 * nodes + 14
      this.style = {
        maxHeight: height + 'px',
      }
    } else {
      this.style = {
        maxHeight: '0px',
      }
    }

    return this.style
  }

  componentDidUpdate() {
    this.user = this.props.user
  }

  render() {
    // <a onClick={ () => this.onClick() }>
    //   <i className={ this.icons }></i> {this.title}
    // </a>
    if (this.isProfile && this.user != undefined) {
      return (
        <div className="user">
          <div className="user__info" onClick={ () => this.onClick() }>
            {/* <img className="user__img" src={this.user.picture} /> */}
            <div>
              <div className="user__name">
                {/* {this.user.kerberos.displayName} {this.user.kerberos.sn} */}
              </div>
              <div className="user__email">
                {/* {this.user.kerberos.mail} */}
              </div>
            </div>
          </div>
          <li className={ this.isToggled() }>
            <ul style={ this.getStyle() }>
              <Link to="/settings">
                <i className="fa fa-cog"></i>
                {' '}Settings
              </Link>
              <Link to="/logout">
                <i className="fa fa-sign-out" />
                {' '} Logout
              </Link>
            </ul>
          </li>
        </div>
        // <li className={ this.isToggled() }>
        //   <a data-ma-action="submenu-toggle" className="media" onClick={ () => this.onClick() }>
        //     <img className="pull-left" src={ this.user.picture } alt="" />
        //     <div className="media-body">
        //       {this.user.kerberos.displayName} {this.user.kerberos.sn}
        //       <small>{this.user.kerberos.mail}</small>
        //     </div>
        //   </a>
        //   <ul style={ this.getStyle() }>
        //     <li>
        //       <Link to="/settings">
        //         <i className="fa fa-cog"></i>
        //         {' '}Settings
        //       </Link>
        //     </li>
        //     <li>
        //       <Link to="/logout">
        //         <i className="fa fa-sign-out" />
        //         {' '} Logout
        //       </Link>
        //     </li>
        //   </ul>
        // </li>
      )
    } else {
      return (
        <li className={ this.isToggled() }>
          <a onClick={ () => this.onClick() }>
            <i className={ this.icons }></i> {this.title}
          </a>
          <ul style={ this.getStyle() }>
            {this.props.children}
          </ul>
        </li>
      )
    }
  }
}
