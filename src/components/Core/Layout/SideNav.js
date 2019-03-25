import React, { Component } from 'react'
import classnames from 'classnames'

import { Link } from '~/components'
import NavSubMenu from './NavSubMenu.js'
import Utils from '~/utils'

class SideNav extends Component {
  constructor(props) {
    super(props)
    this.iStyle = {
      // color: '#32c787'
    }
    this.utils = new Utils()
  }

  render() {
    let hideAppNav = classnames({
      'show': !this.props.loading,
      'hide': this.props.loading,
      'animated': true,
      'fadeInUp': true,
    })

    let permissions = this.props.user.permissions

    return (
      <div>
        <ul className="navigation">
          <NavSubMenu title="profile" isProfile={true} user={this.props.user} />
          <li>
            <Link to="/" className="navigation__active">
              <i className="fa fa-home"></i>
              Home
            </Link>
          </li>
          {/* {this.props.user.permissions.dashboards.is_admin != null
               ?
                  <NavSubMenu icon="c-teal fa fa-bar-chart" title="Dashboards">
                     <li>
                        <Link to="/dashboards">
                           <span style={{paddingRight: '5px'}} className="fa fa-home"></span>
                           Home
                        </Link>
                     </li>
                     <li>
                        <Link to="/dashboards/admin">
                           <span style={{paddingRight: '5px'}} className="fa fa-database"></span>
                           Admin
                        </Link>
                     </li>
                     <li>
                        <Link to="/dashboards-admin-old">
                           <span style={{paddingRight: '5px'}} className="fa fa-database"></span>
                           Admin Old
                        </Link>
                     </li>
                     <li>
                        <Link to="/dashboards/setup">
                           <span style={{paddingRight: '5px'}} className="fa fa-wrench"></span>
                           Setup
                        </Link>
                     </li>
                  </NavSubMenu>
               :
                  <li>
                     <Link to="/dashboards">
                        <i className="fa fa-bar-chart" style={this.iStyle}></i>
                        Dashboards
                     </Link>
                  </li>
               } */}
          <li>
            <Link to="/bzcompliance">
              <i className="fa fa-bug" style={this.iStyle}></i>
              Bugzilla Compliance
            </Link>
          </li>
          <li>
            <Link to="/findsbr">
              <i className="fa fa-search" style={this.iStyle}></i>
              Findsbr
            </Link>
          </li>
          <li>
            <Link to="/support-exceptions">
              <i className="fa fa-globe" style={this.iStyle}></i>
              Support Exceptions
            </Link>
          </li>
          {permissions.releasePlanning != undefined && permissions.releasePlanning.is_developer == true
            ? <li>
              <Link to="/release-planning">
                <i className="fa fa-calendar" style={this.iStyle}></i>
                Release Planning
              </Link>
            </li>
            : <div />
          }
          {permissions.jobs != undefined && permissions.jobs.is_admin == true
            ? <li>
              <Link to="/jobs">
                <i className="fa fa-tasks" style={this.iStyle}></i>
                Job Runner
              </Link>
            </li>
            : <div />
          }
          {permissions.system != undefined && permissions.system.is_admin == true
            ? <NavSubMenu icon="fa fa-database" title="Admin">
              <li>
                <Link to="/admin/permissions">
                  <span className="text-danger fa fa-user-secret"></span>
                  {' '}Permissions
                </Link>
              </li>
              <li>
                <Link to="/admin/logs">
                  <span className="text-danger fa fa-database"></span>
                  {' '}Logs
                </Link>
              </li>
              <li>
                <a>
                  <span className="text-danger fa fa-bell"></span>
                  {' '}Notifications
                </a>
              </li>
              <li>
                <Link to="/admin/change-user">
                  <span className="text-danger fa fa-user"></span>
                  {' '}Change User
                </Link>
              </li>
              <li>
                <Link to="/admin/settings">
                  <span className="text-danger fa fa-cog"></span>
                  {' '}Settings
                </Link>
              </li>
              <li>
                <Link to="/admin/test-api">
                  <span className="text-danger fa fa-code"></span>
                  {' '}Test Api
                </Link>
              </li>
            </NavSubMenu>
            : <div />
          }
          <NavSubMenu icon="text-success fa fa-info" title="Info">
            <li>
              <Link to="/info/api">
                <span style={{
                  paddingRight: '5px'
                }} className="text-danger fa fa-code"></span>
                API
              </Link>
            </li>
          </NavSubMenu>
          <li>
            <a target="_blank" rel="noopener noreferrer" href="https://gitlab.cee.redhat.com/mowens/cee-tools/issues">
              <i className="text-warning fa fa-gitlab"></i>
              Report an Issue
            </a>
          </li>
        </ul>
        <div className={ hideAppNav }>
          { this.props.appNav }
        </div>
      </div>
    )
  }
}

export default SideNav
