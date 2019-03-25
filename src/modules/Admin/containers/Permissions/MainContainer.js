import React, { Component } from 'react'
import { connect } from 'react-redux'
import Utils from '~/utils'
import { Inputs, Loading, Pagination, Link} from '~/components'
import Main from '../components/Main'

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
      }
    }
    this.tab = this.utils.getState().tab
    this.itemsPerPage = 20
  }

  UNSAFE_componentWillMount() {
    var api = {
      path: 'permissions.setup'
    }

    var usersApi = {
      path: 'users.list'
    }

    var appApi = {
      path: 'applications.list'
    }

    this.loading(true)

    var stateObj = this.utils.getState()
    // only fetch users and applications list if not in state
    if (
      stateObj.data === undefined ||
      (stateObj.data.allUsers === undefined && stateObj.data.applications === undefined)
    ) {
      this.utils.request(api).then(data => {
        this.utils.request(usersApi).then(usersData => {
          this.utils.request(appApi).then(appData => {
            this.utils.dispatch('INIT', {
              data: {
                ...data,
                allUsers: usersData,
                applications: appData,
              }
            })
            this.loading(false)
          })
        })
      })
    } else {
      this.utils.request(api).then(data => {
        this.utils.dispatch('INIT', {
          data: {
            ...data,
            allUsers: stateObj.data.allUsers,
            applications: stateObj.data.applications,
          }
        })
        this.loading(false)
      })
    }
  }

  UNSAFE_componentWillUpdate() {
    var stateObj = this.utils.getState()
    if (stateObj.tab != undefined) {
      this.tab = stateObj.tab
    }

    if (stateObj.data != undefined) {
      if (stateObj.data != this.data) {
        this.data = stateObj.data

        this.users = JSON.parse(JSON.stringify(this.data.users))
        this.loading(false)
      }

      if (this.users == undefined) {
        this.users = JSON.parse(JSON.stringify(this.data.users))
      }

      if (this.apis == undefined) {
        this.apis = JSON.parse(JSON.stringify(this.data.apis))
      }

      if (this.allUsers == undefined) {
        this.allUsers = this.data.allUsers
      }

      if (this.applications == undefined) {
        this.applications = this.data.applications
      }

      this.newUsersAutoComp = this.makeNewUsersAutoComp()
      this.applicationsAutoComp = this.makeAppAutoComp()
      this.usersAutoComp = this.makeUsersAutoComp()
      this.apisAutoComp = this.makeApisAutoComp()
    }
  }

  makeNewUsersAutoComp() {
    return (
      <Inputs.Autocomplete
        minSearch={2}
        data={this.data.allUsers}
        searchKey={'uid'}
        searchText={this.newUser.uid}
        onChange={(result) => {
          this.newUser = ''
          if (result.result !== undefined) {
            this.newUser = result.result
          }
        }}
      />
    )
  }

  makeAppAutoComp() {
    return (
      <Inputs.Autocomplete
        placeholder="Enter application"
        minSearch={1}
        data={this.data.applications}
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

  makeUsersAutoComp() {
    return (
      <Inputs.Autocomplete
        placeholder="Enter UID"
        minSearch={1}
        data={this.data.users}
        onChange={(results) => this.getUsersResults(results)}
        searchText={this.searchText.users} />
    )
  }

  makeApisAutoComp() {
    return (
      <Inputs.Autocomplete
        placeholder="Enter module"
        minSearch={1}
        data={this.data.apis}
        searchKey={'module'}
        onChange={(results) => this.getApisResults(results)}
        searchText={this.searchText.apis} />
    )
  }

  changeTool(tool) {
    this.tool = tool
    this.forceUpdate()
  }

  getUsersResults(results) {
    if (results.searchText == '') {
      this.users = JSON.parse(JSON.stringify(this.data.users))
    } else {
      this.users = results.resultsList
    }

    this.searchText.users = results.searchText

    this.setState({
      pages: {
        ...this.state.pages,
        'users': 1,
      }
    })
  }

  getApisResults(results) {
    if (results.searchText == '') {
      this.apis = JSON.parse(JSON.stringify(this.data.apis))
    } else {
      this.apis = results.resultsList
    }

    this.searchText.apis = results.searchText

    this.setState({
      pages: {
        ...this.state.pages,
        'modules': 1,
      }
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
    var body = this.getItemsOnPage(this.apis, 'modules').map((api) => {
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
        {this.renderPagination('modules', this.apis.length)}
      </div>
    )
  }

  makeApplicationsList() {
    if (this.applications === undefined) {
      return <div />
    }

    var body = this.getItemsOnPage(this.applications, 'applications').map((app) => {
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
        {this.renderPagination('applications', this.applications.length)}
      </div>
    )
  }

  makeUsersList() {
    var body = this.getItemsOnPage(this.users, 'users').map((user) => {
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
        {this.renderPagination('users', this.users.length)}
      </div>
    )
  }

  componentWillUnmount() {}

  loading(isLoading) {
    this.setState({loading: isLoading})
  }

  newUserChange(event, type) {
    this.newUser[type] = event.target.value
    this.forceUpdate()
  }

  submitUser() {
    if (this.newUser === undefined) {
      return
    }

    var index = this.users.indexOf(this.newUser.uid)
    if (index == -1 && this.newUser.uid != undefined && this.newUser.uid != ''
      && this.newUser.application != undefined && this.newUser.application != '') {
      var api = {
        path: 'permissions.users.add',
        data: this.newUser
      }

      this.loading(true)
      this.utils.request(api)
      this.utils.getData().then((user) => {
        var setup = {
          path: 'permissions.setup'
        }
        this.utils.request(setup)
        this.utils.getData().then((data) => {
          this.newUser = {}
          this.utils.dispatch('INIT', {data: data})
          this.utils.push('/admin/permissions/user/' + user.id)
        })
      })
    }
  }

  onTabChange(newTab) {
    this.utils.dispatch('CHANGE_TAB', {tab: newTab})
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    }

    return (
      <Main
        newUsersAutoComp={this.newUsersAutoComp}
        applicationsAutoComp={this.applicationsAutoComp}
        usersAutoComp={this.usersAutoComp}
        apisList={this.makeApisList()}
        applicationsList={this.makeApplicationsList()}
        apisAutoComp={this.apisAutoComp}
        newUser={this.newUser}
        newUserChange={(event, type) => this.newUserChange(event, type)}
        submitUser={() => this.submitUser()}
        changeTool={(tool) => this.changeTool(tool)}
        tool={this.tool}
        usersList={this.makeUsersList()}
        currentTab={this.tab}
        onTabChange={(tab) => this.onTabChange(tab)}
      />
    )
  }
}

// export default MainContainer
export default connect(state => ({
  main: state.permissions.main,
}))(MainContainer)
