import React, {Component} from 'react'
// import Utils from '~/utils'
import {Button, Inputs, ToolsWidget, Card} from '~/components'

class Main extends Component {
  constructor(props) {
    super(props)
    // this.utils = new Utils()
    // this.user = this.utils.getUser()
  }

  render() {
    return (
      <div className="animated fadeInRight">
        <div className="row">
          <div className="col-lg-12">
            <Card>
              <Card.Title className="bg-blue-grey">
                <div className="row">
                  <div className="col-lg-6">
                    <h3 className="text-white">Details</h3>
                  </div>
                </div>
              </Card.Title>
              <Card.Body>
                <div className="row">
                  <div className="col-lg-12 text-center">
                    <h3>Permissions by application</h3>
                  </div>
                </div>
                <br />
                {/* <div className="row"> */}
                <div>
                  {this.props.permissionsComponent}
                </div>
                <br />
                <div className="row">
                  <div className="col-lg-12">
                    <Button
                      btnStyle="primary"
                      style={{marginRight: '10px'}}
                      onClick={() => this.props.submitChanges()}
                    >
                      Submit Changes
                    </Button>
                    <Button
                      btnStyle="danger"
                      onClick={() => this.props.revertChanges()}
                    >
                      Revert Changes
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  renderAddAppTool() {
    return (
      <ToolsWidget current={this.props.tool}>
        <div key="hide" />
        <div key="add">
          <div className="row">
            <div className="col-lg-12">
              <Card>
                <Card.Title className="bg-green">
                  <div className="row">
                    <div className="col-lg-6">
                      <h3 className="c-white">Add New Application</h3>
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
                      <label>Application Name</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3">
                      <Inputs.Text
                        value={this.props.newApplication}
                        onChange={event => this.props.handleChange(event)}
                      />
                    </div>
                    <div className="col-lg-1">
                      <Button
                        icon="zmdi zmdi-plus"
                        btnStyle="success"
                        onClick={() => this.props.addNewApplication()}
                      />
                    </div>
                  </div>
                  <br />
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </ToolsWidget>
    )
  }

  renderAddAppButton() {
    // const isAdmin = this.user.permissions.system['is_admin']
    const isAdmin = this.user.permissions_obj.system['is_admin']
    if (!isAdmin) {
      return <div />
    } else {
      return (
        <Button
          icon
          color="bgm-blue"
          onClick={() => this.props.changeTool('add')}
        >
          <i className="zmdi zmdi-plus" />
        </Button>
      )
    }
  }
}

export default Main
