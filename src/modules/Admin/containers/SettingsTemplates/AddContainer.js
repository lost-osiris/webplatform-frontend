import React, { Component } from 'react'
import Add from '../components/Add'
import Utils from '~/utils'
import { Loading } from '~/components'

class AddContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()
    this.state = {
      loading: false,
    }

    this.type = props.type !== undefined ? props.type : 'add'
  }

  UNSAFE_componentWillMount() {
    const api = {
      path: '/applications/list',
    }

    this.setState({ loading: true })
    this.utils.request(api).then(data => {
      this.setState({
        applications: data,
        loading: false,
      })
    })
  }

  submit(template) {
    const api = {
      path: `settings.templates.${this.type}`,
      data: template,
    }

    this.utils.request(api).then(data => {
      if (data !== undefined) {
        this.utils.push('/admin/settings')
      }
    })
  }

  render() {
    return this.state.loading ? <Loading /> : (
      <Add
        type={this.type}
        applications={this.state.applications}
        submit={(template) => this.submit(template)}
        {...this.props}
      />
    )
  }
}

export default AddContainer
