import React, { Component } from 'react'
import { Link } from '~/components'

class SettingsAppNav extends Component {
  render() {
    return (
      <ul className="navigation">
        <li className="navigation__app">
          <span className="navigation__header">
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
    )
  }
}

export default SettingsAppNav
