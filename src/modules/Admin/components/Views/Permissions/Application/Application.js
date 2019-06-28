import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown-it'
import { Button, Inputs, Pagination, Tabs, ToolsWidget, Link, Card } from '~/components'
import PermissionAddTool from './PermissionAddTool'
import Utils from '~/utils'

class Main extends Component {
  constructor(props) {
    super(props)

    var permKeys = Object.keys(props.permissions)
    var textObj = {}
    for (var i in permKeys) {
      textObj[permKeys[i]] = ''
    }

    this.state = {
      users: {},
      searchText: textObj,
      tool: '',
      newPermission: '',
      newPermissions: [],
      pages: {},
      editingDescription: {},
      newDescriptions: this.getPermissionDescriptions(props.permissions),
    }
    this.itemsPerPage = 20
    this.utils = new Utils()
    this.user = this.utils.getUser()

    // padding to line up rows with table rows
    this.rowStyle = { paddingLeft: '30px' }
  }

  getPermissionDescriptions(permissions) {
    const descriptions = {}
    Object.keys(permissions).forEach(perm => {
      descriptions[perm] = permissions[perm].description
    })
    return descriptions
  }


  renderUserAutoComp(permission) {
    return (
      <Inputs.Autocomplete
        type="user"
        api="users.list"
        placeholder="Enter username"
        minSearch={3}
        data={this.props.users}
        searchText={this.state.searchText[permission]}
        onChange={results => this.getUsersResults(permission, results)}
        onSuggestionSelect={uid => this.onSuggestionSelect(uid, permission)}
      />
    )
  }

  getUsersResults(perm, results) {
    if (results.searchText != this.state.searchText[perm]) {
      this.setState({
        searchText: {
          ...this.state.searchText,
          [perm]: results.searchText,
        },
      })
    }
  }

  onSuggestionSelect(uid, perm) {
    this.setState({
      searchText:{
        ...this.state.searhText,
        [perm]: uid
      }
    })
  }

  // Merges permissions fetched from api with locally added permissions.
  // Use this if user can add new individual permissions locally before submitting a request to add users.
  mergePermissions(appPermissions) {
    const permissions = {...appPermissions}
    this.state.newPermissions.forEach(perm => {
      if (appPermissions[perm] === undefined) {
        permissions[perm] = []
      }
    })

    if (permissions['admin'] === undefined) {
      permissions['admin'] = []
    }

    return permissions
  }

  renderTabHeader(appPermissions) {
    const labels = {
      admin: <i className="fa fa-key" />,
      moderator: <i className="fa fa-shield" />,
    }

    return Object.keys(appPermissions).sort().map(permission => {
      const label =
        labels[permission] === undefined ? <i className="fa fa-lock" /> : labels[permission]

      return (
        <a target={permission} key={permission}>
          <span>
            {label} {permission}
          </span>
        </a>
      )
    })
  }

  renderPermissionsTable() {
    if (this.props.permissions === undefined) {
      return <div />
    }

    const appPermissions = this.props.permissions
    const permissions = this.mergePermissions(appPermissions)

    const tabs = (
      <Tabs fill current="admin">
        <Tabs.Nav>
          {this.renderTabHeader(permissions)}
        </Tabs.Nav>
        <Tabs.Content>
          {Object.keys(appPermissions).map(permission => {
            return <div key={permission}> {this.createTabContent(permission, appPermissions[permission].users || [])} </div>
          })}
        </Tabs.Content>
      </Tabs>
    )

    return tabs
  }

  getItemsOnPage(items, tab) {
    return Pagination.getItemsOnPage(items, this.itemsPerPage, this.state.pages[tab] || 1)
  }

  onPage(tab, page) {
    this.setState({
      pages: {
        ...this.state.pages,
        [tab]: page,
      },
    })
  }

  renderPagination(tab, itemCount) {
    const pageCount = Pagination.getPageCount(itemCount, this.itemsPerPage)
    const currentPage = this.state.pages[tab] || 1

    return (
      <Pagination
        align="center"
        viewport={5}
        selected={currentPage}
        count={pageCount}
        onPagePrev={page => this.onPage(tab, page)}
        onPageNext={page => this.onPage(tab, page)}
        onPage={page => this.onPage(tab, page)}
      />
    )
  }

  createTabContent(permission, users) {
    let filteredUsers = this.state.users[permission]
    filteredUsers = filteredUsers === undefined ? users : filteredUsers

    const sortedUsers = filteredUsers.sort()

    const header = (
      <tr>
        <th>User</th>
      </tr>
    )

    const usersList = this.getItemsOnPage(sortedUsers, permission).map(user => {
      return (
        <tr key={user}>
          <td width="60%">
            <Link to={`/admin/permissions/user/${user}`}>
              {user}
            </Link>
          </td>
        </tr>
      )
    })

    let description
    if (this.props.permissions[permission] === undefined) {
      description = 'No description'
    } else {
      description = this.props.permissions[permission].description
    }

    return (
      <div id={permission} key={permission}>
        {this.renderDescription(permission, description)}
        <div className="row" style={this.rowStyle}>
          <div className="col-lg-2">
            {this.renderUserAutoComp(permission)}
          </div>
          <div className="col-lg-2">
            <Button
              btnStyle="primary"
              onClick={() => this.props.handleUserAdd(this.state.searchText[permission], permission)}
              style={{marginTop: '5px'}}
            >
              Add User
            </Button>
          </div>
        </div>
        <table className="table table-hover issue-tracker">
          <thead>
            <tr>
              <th>
              </th>
            </tr>
            {header}
          </thead>
          <tbody>
            {usersList}
          </tbody>
        </table>
        {this.renderPagination(permission, filteredUsers.length)}
      </div>
    )
  }

  handlePermissionAdd() {
    const {newPermission} = this.state

    // Ignoring adds for duplicate permission
    if (newPermission !== '' && this.props.permissions[newPermission] === undefined) {
      this.setState({
        newPermission: '',
        newPermissions: [...this.state.newPermissions, newPermission],
      })
    }
  }

  renderPermissionAddTool() {
    return (
      <PermissionAddTool
        newPermission={this.state.newPermission}
        onPermissionChange={e => this.setState({newPermission: e.target.value})}
        changeTool={tool => this.setState({tool: tool})}
        addPermission={() => this.handlePermissionAdd()}
      />
    )
  }

  renderAddPermissionsButton() {
    const isAdmin = this.utils.checkPermissions('system', 'admin')
    if (!isAdmin) {
      return <div />
    } else {
      return (
        <Button
          icon="zmdi zmdi-plus text-white"
          color="orange"
          onClick={() => this.setState({tool: 'add'})}
        >
        </Button>
      )
    }
  }

  renderEditDescription(permission) {
    return (
      <div style={this.rowStyle}>
        <div className="row">
          <div className="col-lg-6">
            <label>New Description</label>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <Inputs.Text
              type="textarea"
              value={this.state.newDescriptions[permission] || ''}
              onChange={event =>
                this.setState({
                  newDescriptions: {
                    ...this.state.newDescriptions,
                    [permission]: event,
                  },
                })}
              className="fg-input form-control"
              rows="3"
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-lg-6">
            <Button
              btnStyle="primary"
              onClick={() => {
                this.props.handleDescriptionEdit(
                  this.props.application,
                  permission,
                  this.state.newDescriptions[permission]
                )
                this.setState({
                  editingDescription: {
                    ...this.state.editingDescription,
                    [permission]: false,
                  },
                })
              }}
            >
              Update Description
            </Button>
            <Button
              btnStyle="danger"
              style={{marginLeft: '10px'}}
              onClick={() => {
                this.setState({
                  editingDescription: {
                    ...this.state.editingDescription,
                    [permission]: false,
                  },
                })
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  renderDescription(permission, descriptionText) {
    if (this.state.editingDescription[permission]) {
      return this.renderEditDescription(permission)
    }

    const description = !descriptionText ? 'No description' : descriptionText

    return (
      <div style={{paddingLeft: '45px'}}>
        <div className="row">
          <h4>
            <span>
              <i className="zmdi zmdi-quote" /> Permission Description{' '}
            </span>
            <Button
              icon="zmdi zmdi-edit"
              btnStyle="primary"
              onClick={() => {
                this.setState({
                  editingDescription: {
                    ...this.state.editingDescription,
                    [permission]: true,
                  },
                })
              }}
            />
          </h4>
        </div>
        <div className="row">
          <ReactMarkdown escapeHtml={true} source={description} />
        </div>
      </div>
    )
  }

  render() {
    // console.log('app props at render: ', this.props)
    console.log('app state at render: ', this.state)
    return (
      <div>
        <div>
          <ToolsWidget current={this.state.tool}>
            <div key="hide" />
            <div key="add">
              {this.renderPermissionAddTool()}
            </div>
          </ToolsWidget>
          <Card>
            <Card.Title className="bg-blue">
              <div className="row">
                <div className="col-lg-6" />
                <div className="col-lg-6 text-right">
                  <h3>
                    {this.renderAddPermissionsButton()}
                  </h3>
                </div>
              </div>
            </Card.Title>
            <Card.Body>
              {this.renderPermissionsTable()}
            </Card.Body>
          </Card>
        </div>
      </div>
    )
  }
}

export default Main
