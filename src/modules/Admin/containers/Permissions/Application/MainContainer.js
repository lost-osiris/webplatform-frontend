import React, {Component} from 'react'
import {connect} from 'react-redux'
import Utils from '~/utils'
import Main from '../components/Main'
import {Loading} from '~/components'

class MainContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('permissions.application')
    this.state = {
      application: this.props.match.params.name,
      loading: false,
    }
  }

  componentWillMount() {
    const api = {
      path: 'permissions.applications.get',
      data: {
        application: this.state.application,
      },
    }

    this.setState({loading: true})
    this.utils.request(api)
  }

  componentDidMount() {
    const usersListApi = {
      path: 'users.list',
    }

    this.utils.getData().then(data => {
      this.utils.request(usersListApi).then(users => {
        this.utils.dispatch('INIT', {
          data,
          users,
        })

        this.setState({loading: false})
      })
    })
  }

  handleUserAdd(uid, permission) {
    const api = {
      path: 'permissions.applications.add',
      data: {
        uid,
        application: this.state.application,
        permission,
      },
    }

    this.utils.request(api)
    this.utils.getData().then(data => {
      this.utils.dispatch('INIT', {
        data,
      })
    })
  }

  handleDescriptionEdit(application, permission, description) {
    const api = {
      path: 'permissions.descriptions.edit',
      data: {
        application,
        permission,
        description,
      }
    }

    this.utils.request(api).then(data => {
      this.utils.dispatch('INIT', {data})
    })
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    }

    return (
      <Main
        application={this.state.application}
        permissions={this.props.permissions}
        handleUserAdd={(uid, perm) => this.handleUserAdd(uid, perm)}
        handleDescriptionEdit={(app, perm, description) =>
          this.handleDescriptionEdit(app, perm, description)}
        users={this.props.users}
      />
    )
  }
}

const mapStateToProps = state => ({
  permissions: state.permissions.application.permissions,
  users: state.permissions.application.users,
})

export default connect(mapStateToProps)(MainContainer)
