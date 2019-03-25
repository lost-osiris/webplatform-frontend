import React, { Component } from 'react'
import _ from 'lodash'
import { DropDown, ToolsWidget } from '~/components'
import AddContainer from '../containers/AddContainer'
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
          {keys.filter(key => this.props.template[key] !== undefined).map(key => (
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
      <DropDown bgm="bgm-green" icon="zmdi zmdi-menu">
        <li onMouseDown={() => this.changeTool('edit') }>
          <a>Edit Template</a>
        </li>
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
      <div className="animated fadeInUp">
        <ToolsWidget current={this.state.current}>
          <div key="edit">
            <AddContainer
              type="edit"
              template={this.props.template}
              close={() => this.changeTool('')}
              submit={(template) => this.submit(template)}
            />
          </div>
          <div key="placeholder" />
        </ToolsWidget>
        <div className="card">
          <div className="card-header ch-alt">
            <div className="row">
              <div className="col-lg-4">
                <h3>Details</h3>
              </div>
              <div className="col-lg-8 text-right">
                {this.renderDropDown()}
              </div>
            </div>
          </div>
          <div className="card-body card-padding">
            {this.renderInfo()}
          </div>
        </div>
      </div>
    )
  }
}

export default TemplateInfo
