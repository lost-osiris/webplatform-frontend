import React, { Component } from 'react'
import { DropDown } from '~/components'
import TemplateTable from './Table'

class Main extends Component {
  constructor(props) {
    super(props)
  }

  renderDropDown() {
    return (
      <DropDown bgm="bgm-green" icon="zmdi zmdi-menu">
        <li onMouseDown={() => this.utils.push('/admin/settings/templates/add')}>
          <a>Add Template</a>
        </li>
      </DropDown>
    )
  }

  render() {
    return (
      <div className="animated fadeInRight">
        <div className="card">
          <div className="card-header ch-alt">
            <div className="row">
              <div className="col-lg-4">
                <h3>Templates</h3>
              </div>
              <div className="col-lg-8 text-right">
                {this.renderDropDown()}
              </div>
            </div>
          </div>
          <div className="card-body card-padding">
            <TemplateTable
              templates={this.props.templates}
              removeTemplate={(tId) => this.props.removeTemplate(tId)}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Main
