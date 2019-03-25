import React, {Component} from 'react'
import {Button, Inputs, Tabs} from '~/components'
import Utils from '~/utils'

class Permissions extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()
  }

  renderPermissionsTable() {
    const userApps = Object.keys(this.props.applicationPermissions)
      .sort()
      .filter(name => name !== 'admin')
    const labels = {
      bzcompliance: <i className="fa fa-bug" />,
      jobs: <i className="fa fa-tasks" />,
      'support-exceptions': <i className="fa fa-globe" />,
      system: <i className="fa fa-database" />,
      findsbr: <i className="fa fa-search" />,
      'release-planning': <i className="fa fa-calendar" />,
    }

    const tabHeader = userApps.map(app => {
      const label = labels[app] !== undefined ? labels[app] : <i className="fa fa-cube" />
      return (
        <a target={app} key={app}>
          <span>
            {label} {app}
          </span>
        </a>
      )
    })

    const tabBody = (
      <div type="content">
        {userApps.map(app => {
          return this.createTabContent(app, this.getUserPermissions(app))
        })}
      </div>
    )

    const tabs = (
      <Tabs type="tn-justified">
        <div type="nav">
          {tabHeader}
        </div>
        {tabBody}
      </Tabs>
    )

    return tabs
  }

  // returns user's permission data for an app that includes all the
  // application permissions and default permissions initialized
  getUserPermissions(app) {
    const userPermissions = this.props.permissions[app]
    const applicationPermissions = this.props.applicationPermissions[app] || []
    const defaultPermissions = ['admin', 'moderator']

    const result = {...userPermissions}

    // setting any application/default permissions
    // not already in user's permissions as false
    applicationPermissions.forEach(perm => {
      if (result[perm] === undefined) {
        result[perm] = false
      }
    })

    defaultPermissions.forEach(perm => {
      if (result[perm] === undefined) {
        result[perm] = false
      }
    })

    return result
  }

  createTabContent(app, permissions) {
    const header = (
      <tr>
        <th>Name</th>
        <th>Status</th>
      </tr>
    )

    const createPermissionRow = (app, perm) => {
      return (
        <tr key={`${app}-${perm}`}>
          <td width="50%">
            {perm}
          </td>
          <td width="50%" style={{paddingLeft: '0px'}}>
            <Inputs.Switch
              value={this.getUserPermissions(app)[perm] || false}
              onChange={() => this.props.togglePermission(app, perm)}
            />
          </td>
        </tr>
      )
    }

    const permissionsList = Object.keys(permissions).sort().map(perm => {
      return createPermissionRow(app, perm)
    })

    return (
      <div id={app} key={app}>
        <div className="row">
          <div className="col-lg-3">
            <table className="table table-hover issue-tracker">
              <thead>
                {header}
              </thead>
              <tbody>
                {permissionsList}
              </tbody>
            </table>
          </div>
          <div className="col-lg-4">
            {this.renderAddPermissionField(app)}
          </div>
        </div>
      </div>
    )
  }

  // only show the field to add new permission if user is a system admin
  renderAddPermissionField(app) {
    const isAdmin = this.utils.checkPermissions('system', 'admin')
    if (!isAdmin) {
      return <div />
    }

    return (
      <div>
        <Inputs.Text
          value={this.props.inputs[app]}
          placeholder={'Permission Name'}
          onChange={e => this.props.handleInputChange(e, app)}
        />
        <Button
          btnStyle="primary"
          style={{marginTop: '10px'}}
          onClick={() => this.props.addAppPermission(app)}
        >
          Add
        </Button>
      </div>
    )
  }

  render() {
    return this.renderPermissionsTable()
  }
}

Permissions.defaultProps = {
  applicationPermissions: {},
}

export default Permissions
