import React, { Component } from 'react'
import TemplateForm from '../../components/Views/SettingsTemplates/TemplateForm'
import { Utils } from 'webplatform-ui'

class AddContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()

    this.type = props.type !== undefined ? props.type : 'add'
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
    return (
      <TemplateForm
        type={this.type}
        applications={this.props.applications}
        submit={(template) => this.submit(template)}
        {...this.props}
      />
    )
  }
}

export default AddContainer
