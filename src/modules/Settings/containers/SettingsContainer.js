import React, { Component } from 'react'
import { connect } from 'react-redux'

import Utils from '~/utils'
import { Loading } from '~/components'

import Settings from '../components/SettingsComponent'

class SettingsContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('dashboard')
    this.state = {
      loading: true,
    }
  }

  componentWillMount() {
    this.user = this.utils.getUser()
    let api = {
      path: 'settings.build',
    }

    this.utils.request(api).then(data => {
      const get = {
        path: 'settings.get',
        data: {
          output: 'uid',
        },
      }
      this.utils.request(get).then(settings => {
        this.utils.dispatch('SETTINGS', { data: { templates: data, settings } })
        this.setState({ loading: false })
      })
    })
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    }

    return (
      <Settings
        user={this.user}
        templates={this.props.data.templates}
        settings={this.props.data.settings}
        tab={this.props.match.params.tab}
      />
    )
  }
}

const mapStateToProps = state => ({ data: state.dashboard.settings })
export default connect(mapStateToProps)(SettingsContainer)
