import React, {Component} from 'react'
import Utils from '~/utils'
import Main from '../../../components/Views/Permissions/User/User'
import Permissions from '../../../components/Views/Permissions/User/Permissions'

export default class MainContainer extends Component {
  constructor(props) {
    super(props)

    this.utils = new Utils('permissions.user')
    this.newPermission = {}

    let stateObj = this.props.user

    this.state = {
      applications: stateObj.applications || [],
      permissions: this.constructPermissionsObj(props),
      inputs: {},
      tool: '',
      newApplication: '',
    }
  }

  constructPermissionsObj(props) {
    const permissions = {}
    const inputs = {}

    //Construct initial dictionary with all values false
    Object.keys(props.applications).forEach(app => {
      permissions[app] = {}
      inputs[app] = ''

      props.applications[app].forEach(perm => {
        permissions[app][perm] = false
      })
    })

    //Proceed to filp values to true for supplied permissions
    Object.keys(props.user.permissions_obj).forEach(app => {
      props.user.permissions_obj[app].forEach(perm => {
        permissions[app][perm] = true
      })
    })
    return permissions
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.user = nextProps.user
      const permissions = this.constructPermissionsObj(nextProps)

      this.oldPermissions = permissions
      this.oldApplications = this.user.applications

      this.setState({
        permissions,
        applications: this.user.applications,
      })
    }
    return true
  }

  handleChange(event) {
    this.setState({
      newApplication: event.target.value,
    })
  }

  addPermission() {
    const {permission, application} = this.newPermission
    if (permission && application) {
      if (this.props.permissions_obj[application] === undefined) {
        this.setState({
          inputs: {
            [application]: '',
          },
          applications: [...this.state.applications, application],
        })
      }

      this.setState({
        permissions: {
          ...this.props.permissions_obj,
          [application]: {
            ...this.props.permissions_obj[application],
            [permission]: true,
          },
        },
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

      let stateObj = this.state

      stateObj.permissions[app][newPermission] = true
      stateObj.inputs[app] = ''

      this.setState({...stateObj})
    }
  }

  togglePermission(app, perm) {
    const permissions = this.state.permissions
    const appPermissions = permissions[app]

    if (appPermissions === undefined) {
      console.log('APP PERMISSIONS CAME IN UNDEFINED WHEN TRYING TO TOGGLE')
      this.setState({
        permissions: {
          ...permissions,
          [app]: [
            perm,
          ],
        }
      })
    } else {

      //Store current permissions datea
      let updatedPermissions = this.state.permissions

      //Update toggled value (Flip its value)
      updatedPermissions[app][perm] = !updatedPermissions[app][perm]

      //Set the newley updated permissions to the container state
      this.setState({
        permissions: {
          ...updatedPermissions
        }
      })
    }
  }

  handleInputChange(text, app) {
    this.setState({
      inputs: {
        [app]: text,
      },
    })
  }

  createPermissionsComponent() {
    return (
      <Permissions
        applicationPermissions={this.props.applications}
        applications={this.props.user.applications}
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
      ...this.props.user,
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

    //Get old permissions from props, since props would not have changed
    //throughout the process of adding and modifying permissions

    let oldPermissions = this.constructPermissionsObj(this.props)

    this.setState({
      permissions: oldPermissions,
      applications: this.props.applications,
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
    return (
      <Main
        user={this.user}
        applications={this.props.user.applications}
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
