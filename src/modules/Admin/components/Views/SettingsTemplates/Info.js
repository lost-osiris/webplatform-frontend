import React, { Component } from 'react'
import _ from 'lodash'
import { Card, DropDown, ToolsWidget } from '~/components'
// import AddContainer from '../containers/AddContainer'
import TemplateFormContainer from '../../../containers/SettingsTemplates/TemplateFormContainer'
import Utils from '~/utils'

class TemplateInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: '',
    }
    this.utils = new Utils()
  }

  renderInfo() {
    const keys = [
      'title',
      'description',
      'inputType',
      'application',
      'section',
      'isGlobal',
      'isDynamic',
      'isMulti',
      'db',
      'collection',
      'key',
      'values',
      'inputProps',
      'permissions',
      'api'
    ]

    return (
      <table className="table">
        <tbody>
          {keys.filter(key => this.props.template[key] !== undefined && this.props.template[key]  !== '').map(key => (
            <tr key={key}>
              <th width="10%">
                {_.startCase(key)}
              </th>
              <td>
                {this.renderData(this.props.template[key])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  renderData(data) {
    if (typeof data === 'boolean') {
      return data ? 'Yes' : 'No'
    } else if (typeof data === 'object') {
      return <pre>{JSON.stringify(data, null, 2)}</pre>
    } else {
      return data
    }
  }

  renderDropDown() {
    return (
      <DropDown color="green" icon="zmdi zmdi-menu text-white" direction="left" >
        <DropDown.Item onMouseDown={() => this.changeTool('edit')} >
          Edit Template
        </DropDown.Item>
      </DropDown>
    )
  }

  changeTool(tool) {
    this.setState({ current: tool })
  }

  submit(template) {
    const api = {
      path: 'settings.templates.edit',
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
      <div>
        <ToolsWidget current={this.state.current}>
          <div key="edit">
            <TemplateFormContainer
              type="edit"
              template={this.props.template}
              close={() => this.changeTool('')}
              submit={(template) => this.submit(template)}
              applications={this.props.applications}
            />
          </div>
          <div key="placeholder" />
        </ToolsWidget>
        <Card>
          <Card.Title>
            <div className="row">
              <div className="col-lg-4">
                <h3>Details</h3>
              </div>
              <div className="col-lg-8 text-right">
                {this.renderDropDown()}
              </div>
            </div>
          </Card.Title>
          <Card.Body>
            {this.renderInfo()}
          </Card.Body>
        </Card>
      </div>
    )
  }
}

export default TemplateInfo
