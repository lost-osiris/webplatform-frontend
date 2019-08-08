import React, { Component } from 'react'
import { Card, DropDown, Utils } from 'webplatform-ui'
import TemplateTable from './Table'

class Main extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()
  }

  renderDropDown() {
    return (
      <DropDown color="green" icon="zmdi zmdi-menu text-white" direction="left">
        <DropDown.Item onMouseDown={() => this.utils.push('/admin/settings/templates/add')}>
          Add Template
        </DropDown.Item>
      </DropDown>
    )
  }

  render() {
    return (
      <div>
        <Card>
          <Card.Title>
            <div className="row">
              <div className="col-lg-4">
                <h3>Templates</h3>
              </div>
              <div className="col-lg-8 text-right">
                {this.renderDropDown()}
              </div>
            </div>
          </Card.Title>
          <Card.Body>
            <TemplateTable
              templates={this.props.templates}
              removeTemplate={(tId) => this.props.removeTemplate(tId)}
            />
          </Card.Body>
        </Card>
      </div>
    )
  }
}

export default Main
