import React, { Component } from 'react'
import { connect } from 'react-redux'
import Utils from '~/utils'
import { Button, Loading } from '~/components'
import Main from '../components/Main'

class MainContainer extends Component {
  constructor(props) {
    super(props)

    this.utils = new Utils('permissions.api')
  }

  componentWillMount() {
    var api = {
      path: 'permissions.setup',
    }
    this.utils.request(api)
    this.loading(true)
  }

  componentWillReceiveProps(nextProps) {
    this.safeName = nextProps.match.params.safeName
  }

  componentDidMount() {
    this.utils.getData().then((data) => {
      var api = data.apis.find((val) => {
        if (this.safeName == val.safe_name) {
          return val
        }
      })
      this.utils.dispatch('INIT', {data: data}, 'permissions.main')
      this.utils.dispatch('INIT', {api: api}, 'permissions.api')
      this.loading(false)
    })
  }

  componentWillUpdate() {
    var stateObj = this.utils.getState()

    if (stateObj.api != undefined && this.api != stateObj.api) {
      this.api = stateObj.api

      this.formData = JSON.parse(JSON.stringify(this.api))

      this.permissionsComponent = this.makePermissionsComponent()
      this.buttonComponent = this.makeButtonComponent()
    }
  }

  componentWillUnmount() {
    this.utils.dispatch('INIT', {api: undefined})
  }

  loading(isLoading) {
    this.setState({loading: isLoading})
  }

  makePermissionsComponent() {
    var body = ''
    if (this.formData.permissions != undefined && this.formData.permissions.length > 0) {
      body = this.formData.permissions.map((permission) => {
        return (
          <tr key={ permission }>
            <td>{ permission }</td>
            <td><label onClick={ () => this.removePermission(permission) } className="label label-danger" style={ { cursor: 'pointer' } }><i className="fa fa-close"></i></label></td>
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
    this.newPermission = event.target.value
    this.forceUpdate()
  }

  addNewPermission() {
    if (this.newPermission != undefined) {
      if (this.formData.permissions == undefined) {
        this.formData.permissions = []
      }

      if (this.formData.permissions.indexOf(this.newPermission) == -1) {
        this.formData.permissions.push(this.newPermission)
        this.permissionsComponent = this.makePermissionsComponent()
        this.newPermission = undefined
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
          this.loading(false)
        })
      })

      this.loading(true)
    }
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
    if (this.state.loading) {
      return (
        <Loading />
      )
    }

    return (
      <Main
        formData={ this.formData }
        permissionsComponent={ this.permissionsComponent }
        newPermission={ this.newPermission }
        changeNewPermission={ (event) => this.changeNewPermission(event) }
        addNewPermission={ () => this.addNewPermission() }
        buttonComponent={ this.buttonComponent }
        api={ this.api } />
    )
  }
}

export default connect(state => ({
  api: state.permissions.api,
}))(MainContainer)
