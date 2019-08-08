import React, {Component} from 'react'
import {Button, Inputs, Card} from 'webplatform-ui'

class UserAddTool extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <Card>
            <Card.Title className="bg-green">
              <div className="row">
                <div className="col-lg-6">
                  <h3 className="text-white">Add New Permission</h3>
                </div>
                <div className="col-lg-6 text-right">
                  <Button
                    icon="zmdi zmdi-close"
                    btnStyle="danger"
                    onClick={() => this.props.changeTool('')}
                  />
                </div>
              </div>
            </Card.Title>
            <Card.Body>
              <div className="row">
                <div className="col-lg-6">
                  <label>Permission Name</label>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <Inputs.Text
                    value={this.props.newPermission}
                    onChange={event => this.props.onPermissionChange(event)}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-lg-6">
                  <Button
                    btnStyle="primary"
                    onClick={() => this.props.addPermission()}
                  >
                    Add Permission
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    )
  }
}

export default UserAddTool
