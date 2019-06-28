import React, { Component } from 'react'
import TemplateInfo from '../../components/Views/SettingsTemplates/Info'
import Utils from '~/utils'

class InfoContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()
  }

  render() {
    return (
      <TemplateInfo
        template={this.props.template}
      />
    )
  }
}

export default InfoContainer
