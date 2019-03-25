import React, {Component} from 'react'
// import {ToolsWidget} from '~/components'
import {Tabs} from '~/components'
import UserAddTool from './UserAddTool'

class Main extends Component {
  constructor(props) {
    super(props)
  }

  renderUserView() {
    return (
      <div id="users" key="users">
        <table className="table table-hover">
          <thead>
            <tr>
              <td>
                {this.props.usersAutoComp}
              </td>
            </tr>
          </thead>
        </table>
        {this.props.usersList}
        {/* <div className="row">
          <div className="col-lg-12 text-right">
            <h3>
              <Button
                icon
                color="bgm-blue"
                onClick={() => this.props.changeTool('add')}
              >
                <i className="zmdi zmdi-plus" />
              </Button>
            </h3>
          </div>
        </div> */}
      </div>
    )
  }

  renderModulesView() {
    return (
      <div id="modules" key="modules">
        <table className="table table-hover">
          <thead>
            <tr>
              <td>
                {this.props.apisAutoComp}
              </td>
            </tr>
          </thead>
        </table>
        {this.props.apisList}
      </div>
    )
  }

  renderApplicationsView() {
    return (
      <div id="applications" key="applications">
        {this.props.applicationsList}
      </div>
    )
  }

  renderUserAddTool() {
    return (
      <UserAddTool
        newUsersAutoComp={this.props.newUsersAutoComp}
        applicationsAutoComp={this.props.applicationsAutoComp}
        submitUser={this.props.submitUser}
        changeTool={this.props.changeTool}
      />
    )
  }

  renderContent() {
    return (
      <div>
        {/* <ToolsWidget current={this.props.tool}>
          <div key="hide" />
          <div key="add">
            {this.renderUserAddTool()}
          </div>
        </ToolsWidget> */}
        <div className="card">
          <div className="card-body card-padding">
            <Tabs
              type="tn-justified"
              current={this.props.currentTab}
              onChange={tab => this.props.onTabChange(tab)}
            >
              <div type="nav">
                <a target="users">
                  <span>
                    <i className="fa fa-users" /> Users
                  </span>
                </a>
                <a target="modules">
                  <span>
                    <i className="fa fa-cubes" /> Modules
                  </span>
                </a>
                <a target="applications">
                  <span>
                    <i className="fa fa-th-large" /> Applications
                  </span>
                </a>
              </div>
              <div type="content">
                {this.renderUserView()}
                {this.renderModulesView()}
                {this.renderApplicationsView()}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return this.renderContent()
  }
}

export default Main
