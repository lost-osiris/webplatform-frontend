import React, { Component } from 'react'
import { Button, Inputs } from '~/components'

class Main extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="animated fadeInRight">
        <div className="alert alert-info">
          <h2 className="c-white">API Editing Page</h2>
          <p>You can view and edit permissions for an API here.</p>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header bgm-bluegray">
                <h3 className="c-white">Details</h3>
              </div>
              <div className="card-body card-padding">
                <div className="row">
                  <div className="col-lg-12">
                    <label>Application</label>
                    <h3>{ this.props.formData.application } </h3>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-lg-10">
                    <label>New Permission</label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-11">
                    <Inputs.Text value={ this.props.newPermission } onChange={ (event) => this.props.changeNewPermission(event) } />
                  </div>
                  <div className="col-lg-1">
                    <Button
                      icon
                      color="bgm-green"
                      onClick={() => this.props.addNewPermission()}
                    >
                      <i className="zmdi zmdi-plus" />
                    </Button>
                  </div>
                </div>
                <br />
                <h3 className="text-center">Current Permissions</h3>
                <div className="row">
                  <div className="col-lg-12">
                    { this.props.permissionsComponent }
                  </div>
                </div>
                <br />
                { this.props.buttonComponent }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Main
