import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import moment from 'moment'

import { Button, Inputs } from '~/components'
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
    }
  }

  componentDidMount() {
    let api = {
      path: 'users.change-user'
    }

    this.utils.request(api).then((data) => {
      this.setState({usersList: data})
    })
  }

  handleChange(result) {
    this.setState({newUser: result.searchText, isExact: result.exact})
  }

  submit() {
    console.log('submit detected')
    if (this.state.isExact) {
      console.log('exact')
      let newDate = moment().add(24, 'hours')
      this.cookies.set('login', this.state.newUser, {expires: newDate.toDate(), path: '/'})
      this.utils.go('/admin/change-user')
    }
  }

  render() {

    var currentUser = this.utils.getUser()

    return (
      <div className="row animated fadeInUp">
        <div className="col-lg-12">
          <h3>Current User - { currentUser.uid }</h3>
        </div>
        <div className="col-lg-12">
          <Inputs.Autocomplete
            type="user"
            placeholder="Enter username..."
            minSearch={3}
            searchText={this.state.newUser}
            onChange={result => this.handleChange(result)}
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
