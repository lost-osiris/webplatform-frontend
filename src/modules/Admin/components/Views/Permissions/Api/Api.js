import React, { Component } from 'react'
import { Card, Button, Inputs } from '~/components'

class Main extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div className="alert alert-info">
          <h2 className="text-white">API Editing Page</h2>
          <p>You can view and edit permissions for an API here.</p>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Card>
              <Card.Title className="bg-blue-grey">
                <h3 className="text-white">Details</h3>
              </Card.Title>
              <Card.Body className="card-padding">
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
                      icon="zmdi zmdi-plus text-white"
                      color="green"
                      onClick={() => this.props.addNewPermission()}
                    >
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
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}

export default Main
