import React, { Component } from 'react'
import { Link, Button } from 'webplatform-ui'

class TemplateTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <table className="table table-striped animated fadeInUp">
        <thead>
          <tr>
            <th width="25%">Title</th>
            <th width="25%">Application</th>
            <th width="25%">Section</th>
            <th width="20%">Input Type</th>
            <th width="5%">Remove</th>
          </tr>
        </thead>
        <tbody>
          {this.props.templates.map(template => (
            <tr key={template.name}>
              <td>
                <Link to={`/admin/settings/templates/name/${template.name}`}>
                  {template.title}
                </Link>
              </td>
              <td>{template.application}</td>
              <td>{template.section}</td>
              <td>{template.inputType}</td>
              <td><Button btnStyle="danger" icon onClick={() => this.props.removeTemplate(template.id)}><i className="fa fa-times" /></Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

export default TemplateTable
