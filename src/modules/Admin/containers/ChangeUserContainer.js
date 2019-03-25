import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import moment from 'moment'

import { Button, Inputs, Loading } from '~/components'
import Utils from '~/utils'

export default class ChangeUserContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()
    this.cookies = new Cookies()
    this.state = {
      usersList: [],
      newUser: '',
      isExact: false,
      loading: true,
    }

  }

  UNSAFE_componentWillMount() {
    this.currentUser = this.utils.getUser()

    let api = {
      path: 'users.change-user'
    }

    this.utils.request(api).then((data) => {
      this.setState({loading: false, usersList: data})
    })
  }

  handleChange(result) {
    this.setState({newUser: result.searchText, isExact: result.exact})
  }

  submit() {
    if (this.state.isExact) {
      let newDate = moment().add(24, 'hours')
      this.cookies.set('login', this.state.newUser, {expires: newDate.toDate(), path: '/'})
      this.utils.go('/admin/change-user')
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    }

    return (
      <div className="row animated fadeInRight">
        <div className="col-lg-12">
          <h3>Current User - { this.currentUser.uid }</h3>
        </div>
        <div className="col-lg-12">
          <Inputs.Autocomplete
            minSearch={2}
            onChange={result => this.handleChange(result)}
            data={this.state.usersList}
            searchKey={'uid'}
            searchText={this.state.newUser}
            placeholder="New user to sign in as"
          />
          <Button
            style={{marginTop: '15px'}}
            btnStyle="primary"
            onClick={() => this.submit()}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }
}
