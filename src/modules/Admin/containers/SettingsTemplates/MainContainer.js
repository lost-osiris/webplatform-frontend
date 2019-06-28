import Main from '../../components/Views/SettingsTemplates/Main'
import React, {Component} from 'react'
import Utils from '~/utils'

class MainContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()
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
