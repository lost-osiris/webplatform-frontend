import React, { Component } from 'react'
import { Button, Utils } from 'webplatform-ui'
import Main from '../../../components/Views/Permissions/Api/Api'

export default class MainContainer extends Component {
  constructor(props) {
    super(props)

    this.utils = new Utils('permissions.api')
    this.state= {newPermission : ''}

    this.formData = JSON.parse(JSON.stringify(this.props.api))
    this.permissionsComponent = this.makePermissionsComponent()
    this.buttonComponent = this.makeButtonComponent()
  }

  shouldComponentUpdate(){
    var stateObj = this.utils.getState()

    if (stateObj.api != undefined && this.api != stateObj.api) {
      this.api = stateObj.api

      this.formData = JSON.parse(JSON.stringify(this.api))

      this.permissionsComponent = this.makePermissionsComponent()
      this.buttonComponent = this.makeButtonComponent()
    }
    return true
  }

  componentWillUnmount() {
    this.utils.dispatch('INIT', {api: undefined})
  }

  makePermissionsComponent() {
    var body = ''
    if (this.formData.permissions != undefined && this.formData.permissions.length > 0) {
      body = this.formData.permissions.map((permission) => {

        var deletePermProps = {
          onClick: () => this.removePermission(permission),
          icon: 'text-white zmdi zmdi-close',
          btnStyle: 'danger',
          text: '', //Used to make button square

        }
        return (
          <tr key={ permission }>
            <td>{ permission }</td>
            <td><Button {...deletePermProps} /></td>
          </tr>
        )
      })
    }
    else {
      body = (
        <tr>
          <td>None</td>
          <td></td>
        </tr>
      )
    }

    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <td>Permission</td>
            <td>Remove</td>
          </tr>
        </thead>
        <tbody>
          { body }
        </tbody>
      </table>
    )
  }

  changeNewPermission(event) {
    this.setState({newPermission: event})
    this.forceUpdate()
  }

  addNewPermission() {
    if (this.state.newPermission != '') {
      if (this.formData.permissions == undefined) {
        this.formData.permissions = []
      }

      if (this.formData.permissions.indexOf(this.state.newPermission) == -1) {
        this.formData.permissions.push(this.state.newPermission)
        this.permissionsComponent = this.makePermissionsComponent()
        this.setState({newPermission: ''})
        this.forceUpdate()
      }
    }
  }

  removePermission(name) {
    var index = this.formData.permissions.indexOf(name)
    if (index > -1) {
      this.formData.permissions.splice(index, 1)
      this.permissionsComponent = this.makePermissionsComponent()
      this.forceUpdate()
    }
  }

  submitChanges() {
    if (this.formData.application != '') {
      var api = {
        path: 'permissions.apis.edit',
        data: this.formData,
      }

      this.utils.request(api).then((api) => {
        this.utils.request({path: 'permissions.setup'}).then((data) => {
          this.utils.dispatch('INIT', {api: api})
          this.utils.dispatch('INIT', {data: data}, 'permissions.main')
        })
      })
    }
  }

  revertChanges() {
    this.formData = JSON.parse(JSON.stringify(this.props.api))
    this.permissionsComponent = this.makePermissionsComponent()
    this.forceUpdate()
  }

  makeButtonComponent() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <Button
            btnStyle="primary"
            style={{ marginRight: '10px' }}
            onClick={() => this.submitChanges()}
          >
            Submit Changes
          </Button>
          <Button
            btnStyle="danger"
            onClick={() => this.revertChanges()}
          >
            Revert Changes
          </Button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Main
        formData={ this.formData }
        permissionsComponent={ this.permissionsComponent }
        // newPermission={ this.newPermission }
        newPermission={ this.state.newPermission }
        changeNewPermission={ (event) => this.changeNewPermission(event) }
        addNewPermission={ () => this.addNewPermission() }
        buttonComponent={ this.buttonComponent }
        // api={ this.api }
        api={ this.props.api }
      />
    )
  }
}
