import React, { Component } from 'react'
import { Button } from '~/components'

class UserAddTool extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header bgm-green">
              <div className="row">
                <div className="col-lg-6">
                  <h3 className="c-white">Add New User</h3>
                </div>
                <div className="col-lg-6 text-right">
                  <Button
                    icon
                    color="bgm-black"
                    onClick={() => this.props.changeTool('')}
                  >
                    <i className="zmdi zmdi-close c-red" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="card-body card-padding">
              <div className="row">
                <div className="col-lg-6">
                  <label>User Id</label>
                </div>
                <div className="col-lg-6">
                  <label>Application</label>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  {/* <Inputs.Text value={ this.props.newUser.uid } onChange={ (event) => this.props.newUserChange(event, 'uid') } /> */}
                  {this.props.newUsersAutoComp}
                </div>
                <div className="col-lg-6">
                  {this.props.applicationsAutoComp}
                  {/* <Inputs.Text value={ this.props.newUser.application } onChange={ (event) => this.props.newUserChange(event, 'application') } /> */}
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-lg-6">
                  <Button
                    btnStyle="primary"
                    onClick={() => this.props.submitUser()}
                  >
                    Add User
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserAddTool
