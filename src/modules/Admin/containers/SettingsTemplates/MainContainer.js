import React, { Component } from 'react'
import Main from '../../components/Views/SettingsTemplates/Main'
import { Utils } from 'webplatform-ui'

class MainContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()
  }

  getTemplates() {
    let api = {
      path: 'settings.templates.list',
    }

    this.utils.request(api).then(data => {
      this.utils.dispatch('TEMPLATES_INIT', {data: data}, 'settings')
    })
  }

  removeTemplate(tId) {
    let api = {
      path: 'settings.templates.remove',
      data: {
        id: tId
      },
    }

    this.utils.request(api).then((data) => {
      if (data != undefined) {
        this.getTemplates()
      }
    })
  }

  render() {
    return (
      <Main templates={this.props.templates} removeTemplate={(tId) => this.removeTemplate(tId) } />
    )
  }
}

export default MainContainer
