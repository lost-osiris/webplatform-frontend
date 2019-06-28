import React, { Component } from 'react'
import Add from '../../components/Views/SettingsTemplates/Add'
import Utils from '~/utils'

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
      <Add
        type={this.type}
        applications={this.props.applications}
        submit={(template) => this.submit(template)}
        {...this.props}
      />
    )
  }
}

export default AddContainer
