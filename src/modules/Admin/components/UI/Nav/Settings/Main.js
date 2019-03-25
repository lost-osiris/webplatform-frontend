import React, { Component } from 'react'
import { Link } from '~/components'

class SettingsAppNav extends Component {
  render() {
    return (
      <div>
        <ul className="main-menu">
          <li className="nav-header">
            <span>
              <Link to='/admin/settings'> Settings </Link>
            </span>
          </li>
          <li><Link to={ '/admin/settings' }><i className="fa fa-database"></i>Templates</Link> </li>
          <li>
            <Link to={'/admin/settings/templates/add'}>
              <i className="zmdi zmdi-plus">
              </i>
              Add Template
            </Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default SettingsAppNav
