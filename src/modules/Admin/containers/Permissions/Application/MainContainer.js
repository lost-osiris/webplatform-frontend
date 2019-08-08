import React, { Component } from 'react'
import { Utils } from 'webplatform-ui'
import Main from '../../../components/Views/Permissions/Application/Application'

export default class MainContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('permissions.application')
  }

  handleUserAdd(uid, permission) {
    const api = {
      path: 'permissions.applications.add',
      data: {
        uid: uid,
        application: this.props.match.params.name,
        permission,
      },
    }

    this.utils.request(api).then(data => {
      this.utils.dispatch('INIT', { permissions: data })
    })
  }

  handleDescriptionEdit(application, permission, description) {
    const api = {
      path: 'permissions.descriptions.edit',
      data: {
        application,
        permission,
        description,
      }
    }

    this.utils.request(api).then(data => {
      this.utils.dispatch('INIT', {permissions: data})
    })
  }

  render() {
    let application = this.props.match.params.name
    return (
      <Main
        application={application}
        permissions={this.props.permissions}
        handleUserAdd={(uid, perm) => this.handleUserAdd(uid, perm)}
        handleDescriptionEdit={(app, perm, description) =>
          this.handleDescriptionEdit(app, perm, description)}
        users={this.props.users}
      />
    )
  }
}
