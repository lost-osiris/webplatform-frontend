import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Loading} from '~/components'
import Utils from '~/utils'
import Main from '../components/Main'
import Permissions from '../components/Permissions'

class MainContainer extends Component {
  constructor(props) {
    super(props)
    this.safeName = props.safeName

    this.utils = new Utils('permissions.user')
    this.newPermission = {}

    this.state = {
      applications: [],
      permissions: {},
      inputs: {},
      tool: '',
      newApplication: '',
    }
  }

  componentWillMount() {
    var api = {
      path: 'permissions.users.get',
      data: {
        uid: this.props.match.params.uid,
      },
    }
    this.utils.request(api)
    this.loading(true)
  }

  componentDidMount() {
    const listApi = {
      path: 'permissions.applications.list',
    }

    this.utils.getData().then(userData => {
      this.utils.request(listApi).then(listData => {
        this.utils.dispatch('INIT', {user: userData, applications: listData})
        this.loading(false)
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.user = nextProps.user
      this.user = nextProps.user
      const permissions = {}
      const inputs = {}

      Object.keys(this.user.permissions_obj).forEach(app => {
        permissions[app] = {}
        inputs[app] = ''

        this.user.permissions_obj[app].forEach(perm => {
          permissions[app][perm] = true
        })
      })

      this.oldPermissions = permissions
      this.oldApplications = this.user.applications

      this.setState({
        permissions,
        applications: this.user.applications,
      })
    }
  }

  handleChange(event) {
    this.setState({
      newApplication: event.target.value,
    })
  }

  addPermission() {
    const {permission, application} = this.newPermission
    if (permission && application) {
      if (this.state.permissions[application] === undefined) {
        this.setState({
          inputs: {
            [application]: '',
          },
          applications: [...this.state.applications, application],
        })
      }

      this.setState({
        permissions: {
          ...this.state.permissions,
          [application]: {
            ...this.state.permissions[application],
            [permission]: true,
          },
        },
      })
    }
  }

  addNewApplication() {
    const app = this.state.newApplication
    if (app && !this.state.applications.includes(app)) {
      this.setState({
        applications: [...this.state.applications, app],
        permissions: {
          ...this.state.permissions,
          [app]: {},
        },
        newApplication: '',
      })
    }
  }

  removeNewPermission(id) {
    const newPermissions = [...this.state.pendingAdds]
    const index = newPermissions.find(permission => permission.id === id)
    newPermissions.splice(index, 1)

    this.setState({
      pendingAdds: newPermissions,
    })
  }

  addAppPermission(app) {
    const newPermission = this.state.inputs[app]
    if (newPermission) {
      this.setState({
        permissions: {
          ...this.state.permissions,
          [app]: {
            ...this.state.permissions[app],
            [newPermission]: true,
          },
        },
        inputs: {
          ...this.state.inputs,
          [app]: '',
        },
      })
    }
  }

  togglePermission(app, perm) {
    const permissions = this.state.permissions
    const appPermissions = permissions[app]

    if (appPermissions === undefined) {
      this.setState({
        permissions: {
          ...permissions,
          [app]: {
            [perm]: true,
          },
        }
      })
    } else {
      this.setState({
        permissions: {
          ...permissions,
          [app]: {
            ...appPermissions,
            [perm]: !appPermissions[perm],
          },
        },
      })
    }
  }

  handleInputChange(event, app) {
    this.setState({
      inputs: {
        [app]: event.target.value,
      },
    })
  }

  createPermissionsComponent() {
    return (
      <Permissions
        applicationPermissions={this.props.applications}
        applications={this.state.applications}
        permissions={this.state.permissions}
        inputs={this.state.inputs}
        togglePermission={(app, perm) => this.togglePermission(app, perm)}
        handleInputChange={(event, app) => this.handleInputChange(event, app)}
        addAppPermission={(app) => this.addAppPermission(app)}
      />
    )
  }

  submitChanges() {
    const permissions_obj = {}
    const permissions = this.state.permissions
    const applications = [...this.state.applications]

    Object.keys(permissions).forEach(app => {
      permissions_obj[app] = []
      const appPermissions = permissions[app]

      // adding to applications list so that permission is set for the
      // new application
      if (!applications.includes(app)) {
        applications.push(app)
      }

      Object.keys(appPermissions)
        // only adding permissions that are checked
        .filter(perm => appPermissions[perm])
        .forEach(selectedPerm => {
          permissions_obj[app].push(selectedPerm)
        })
    })

    const data = {
      ...this.user,
      permissions_obj,
      applications: applications,
    }

    const api = {
      path: 'permissions.users.edit',
      data,
    }

    const listApi = {
      path: 'permissions.applications.list',
    }

    this.loading(true)

    this.utils.request(api).then(userData => {
      this.utils.request(listApi).then(listData => {
        this.utils.dispatch('INIT', {user: userData, applications: listData})
        this.loading(false)
      })
    })
  }

  revertChanges() {
    this.setState({
      permissions: this.oldPermissions,
      applications: this.oldApplications,
    })
  }

  loading(isLoading) {
    this.setState({loading: isLoading})
  }

  changeTool(tool) {
    this.setState({
      tool,
    })
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    }

    return (
      <Main
        user={this.user}
        applications={this.props.applications}
        newApplication={this.state.newApplication}
        tool={this.state.tool}
        handleChange={(event, type) => this.handleChange(event, type)}
        submitChanges={() => this.submitChanges()}
        revertChanges={() => this.revertChanges()}
        permissionsComponent={this.createPermissionsComponent()}
        changeTool={tool => this.changeTool(tool)}
        addNewApplication={app => this.addNewApplication(app)}
      />
    )
  }
}

export default connect(state => {
  let user, applications
  const permissionState = state['permissions']

  if (permissionState === undefined) {
    user = {}
    applications = {}
  } else {
    user = permissionState.user.user
    applications = permissionState.user.applications
  }

  return {
    user,
    applications,
  }
})(MainContainer)
