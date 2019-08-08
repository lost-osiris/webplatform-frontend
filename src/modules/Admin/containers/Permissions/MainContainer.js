import React, { Component } from 'react'
import { Inputs, Pagination, Link, Utils } from 'webplatform-ui'
import Main from '../../components/Views/Permissions/Main'

class MainContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('permissions.main')
    this.searchText = {
      users: '',
      apis: ''
    }

    this.newUser = {}
    this.tool = ''
    this.state = {
      loading: true,
      pages: {
        users: 1,
        modules: 1,
        applications: 1,
      },
      filteredUsers: props.users,
      filteredApis: props.apis
    }
    this.itemsPerPage = 20
  }

  setup() {
    this.applicationsAutoComp = this.makeAppAutoComp()
    this.usersAutoComp = this.makeUsersAutoComp()
    this.apisAutoComp = this.makeApisAutoComp()
  }

  // Construction of application autocomplete
  makeAppAutoComp() {
    return (
      <Inputs.Autocomplete
        placeholder="Enter application"
        minSearch={1}
        data={this.props.apps}
        searchKey={'name'}
        onChange={(result) => {
          this.application = ''
          if (result.result !== undefined) {
            this.application = result.result
          }
        }}
        searchText={this.searchText.application}
      />
    )
  }

  // Construction of user autocomplete
  makeUsersAutoComp() {
    return (
      <Inputs.Autocomplete
        type="user"
        placeholder="Enter UID"
        minSearch={2}
        onChange={(results) => this.getUsersResults(results)}
        searchText={this.searchText.users} />
    )
  }

  // Construction of api autocomplete
  makeApisAutoComp() {
    return (
      <Inputs.Autocomplete
        placeholder="Enter module"
        minSearch={1}
        data={this.props.apis}
        searchKey={'module'}
        onChange={(results) => this.getApisResults(results)}
        searchText={this.searchText.apis} />
    )
  }

  changeTool(tool) {
    this.tool = tool
    this.forceUpdate()
  }

  /**
   * Retrieves the results from the user autocomplete and appropriatley filters and constructs
   * the new table to reflect suggestions 
   * 
   * @param {*} data - data returned out of autocomplete via it's onChange prop
   */
  getUsersResults(data) {
    let newState = {
      pages: {
        ...this.state.pages,
        'users': 1,
      },
    }

    // If autocomplete results are showing at least 1 item
    if (data.toggled && data.results.length > 0) {
      // Set the table to match the list of autocomplete suggestions (results)
      newState.filteredUsers = this.filterUsers(data.searchText, data.results)
    }
    // If there is an exact text match or the user selected a suggestion
    else if (data.exact || data.selected) {
      // Set the table to display that exact / selected suggestion
      newState.filteredUsers = this.filterUsers([data.selectedValue])
    }
    // If the autocomplete is blank
    else if (data.searchText === '') {
      // Set the table to display the complete list
      newState.filteredUsers = this.props.users
    }

    this.searchText.users = data.searchText

    this.setState(newState)
  }

  /**
   * Retrieves the results from the api autocomplete and appropriatley filters and constructs
   * the new table to reflect suggestions 
   * 
   * @param {*} data - data returned out of autocomplete via it's onChange prop
   */
  getApisResults(data) {
    let filteredApis = this.props.apis

    // If the autocomplete is displaying results
    if (data.toggled) {
      // Filter the list of api calls based off of autocomplete's suggestions
      filteredApis = this.filterApis(data.results)
    } 
    // Otherwise, if the typed in content is an exact match or the user clicked a suggestion
    else if (data.exact || data.selected) {
      // Set the table to only display that exact match / clicked value
      filteredApis = this.filterApis([data.selectedValue])
    }

    this.searchText.apis = data.searchText

    this.setState({
      pages: {
        ...this.state.pages,
        'modules': 1,
      },
      filteredApis: filteredApis
    })
  }

  /**
   * Filters the users into a structure that can be passed to the
   * table, making the table match the suggested users listed in the autocomplete
   *
   * @param {*} autocompleteResults - List of autocomplete results to base filter off of
   */
  filterUsers(searchText, autocompleteResults) {
    return this.props.users.filter((result) => {
      // If the list of results is the entire list of users, or the entered text is not found, display all users
      if (autocompleteResults.length === this.props.users.length || result.indexOf(searchText) > -1) {
        return true
      }

      // Loop though and filter all uids that match list
      for (let i = 0; i < autocompleteResults.length; i++) {
        if (result === autocompleteResults[i].uid) {
          return true
        }
      }

      return false
    })
  }

  /**
   * Filters the api modules into a structure that can be passed to the
   * table, making the table match the suggested modules listed in the autocomplete
   *
   * @param {*} autocompleteResults - List of autocomplete results to base filter off of
   */
  filterApis(autocompleteResults) {
    return this.props.apis.filter((result) => {
      // If the list of results is the entire list of apis, display all users
      if (autocompleteResults.length === this.props.apis.length) {
        return true
      }

      // Loop though and filter all aips that match list
      for (let i = 0; i < autocompleteResults.length; i++) {
        if (result.module === autocompleteResults[i].rawData) {
          return true
        }
      }

      return false
    })
  }

  onPage(tab, page) {
    this.setState({
      pages: {
        ...this.state.pages,
        [tab]: page,
      }
    })
  }

  renderPagination(tab, itemCount) {
    const pageCount = Pagination.getPageCount(itemCount, this.itemsPerPage)
    const currentPage = this.state.pages[tab]

    return (
      <Pagination
        viewport={5}
        align="center"
        selected={currentPage}
        count={pageCount}
        onPagePrev={page => this.onPage(tab, page)}
        onPageNext={page => this.onPage(tab, page)}
        onPage={page => this.onPage(tab, page)}
      />
    )
  }

  getItemsOnPage(items, tab) {
    return Pagination.getItemsOnPage(items, this.itemsPerPage, this.state.pages[tab])
  }

  makeApisList() {

    // var body = this.getItemsOnPage(this.props.apis, 'modules').map((api) => {
    var body = this.getItemsOnPage(this.state.filteredApis, 'modules').map((api) => {
      return (
        <tr key={api.id}>
          <td>
            <Link to={`/admin/permissions/api/${api.safe_name}`}>{api.module}</Link>
          </td>
          <td>{api.application}</td>
        </tr>
      )
    })

    return (
      <div>
        <table className="table table-hover">
          <thead>
            <tr>
              <td>Module</td>
              <td>Application</td>
            </tr>
          </thead>
          <tbody>
            {body}
          </tbody>
        </table>
        {this.renderPagination('modules', this.state.filteredApis.length)}
      </div>
    )
  }

  makeApplicationsList() {
    var body = this.getItemsOnPage(this.props.apps, 'applications').map((app) => {
      return (
        <tr key={app.name}>
          <td>
            <Link to={`/admin/permissions/application/${app.name}`}>{app.name}</Link>
          </td>
        </tr>
      )
    })

    return (
      <div>
        <table className="table table-hover">
          <thead>
            <tr>
              <td>Application</td>
            </tr>
          </thead>
          <tbody>
            {body}
          </tbody>
        </table>
        {this.renderPagination('applications', this.props.apps.length)}
      </div>
    )
  }

  makeUsersList() {
    var body = this.getItemsOnPage(this.state.filteredUsers, 'users').map((user) => {
      return (
        <tr key={user}>
          <td>
            <Link to={`/admin/permissions/user/${user}`}>{user}</Link>
          </td>
        </tr>
      )
    })

    return (
      <div>
        <table className="table table-hover">
          <thead>
            <tr>
              <td>UID</td>
            </tr>
          </thead>
          <tbody>
            {body}
          </tbody>
        </table>
        {this.renderPagination('users', this.state.filteredUsers.length)}
      </div>
    )
  }

  newUserChange(event, type) {
    this.newUser[type] = event.target.value
    this.forceUpdate()
  }

  render() {

    this.setup()

    return (
      <Main
        applicationsAutoComp={this.applicationsAutoComp}
        usersAutoComp={this.usersAutoComp}
        apisList={this.makeApisList()}
        applicationsList={this.makeApplicationsList()}
        apisAutoComp={this.apisAutoComp}
        submitUser={() => this.submitUser()}
        usersList={this.makeUsersList()}
        currentTab={'users'}
      />
    )
  }
}

export default MainContainer
