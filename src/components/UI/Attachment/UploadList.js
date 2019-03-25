import React, { Component } from 'react'
import { Inputs } from '~/components'

export default class UploadList extends Component {
  constructor(props) {
    super(props)
  }

  findAttachmentIndex(source, attachment) {
    return source.findIndex(el => {
      return el.id === attachment.id
    })
  }

  renderSelect(attachment) {
    if (!this.props.existingAttachments) {
      return false
    }

    const index = this.findAttachmentIndex(this.props.uploadedFiles, attachment)
    const isAttached = index >= 0

    return (
      <td style={{ padding: 0, paddingTop: '20px' }}>
        <Inputs.Switch
          value={isAttached}
          onChange={() => this.props.handleSelect(attachment, !isAttached)}
        />
      </td>
    )
  }

  renderFileLink(file) {
    if (file.url) {
      return (
        <a href={`${file.filename}`} download>
          {file.filename}
        </a>
      )
    } else {
      return (
        <a href={`/download/${file.id}`} download>
          {file.filename}
        </a>
      )
    }
  }

  render() {
    if (!this.props.uploads.length) {
      if (this.props.existingAttachments) {
        return (
          <h2 className="text-center">
            No existing attachments found.
          </h2>
        )
      }
      return <div />
    }

    return (
      <table className="table">
        <thead>
          <tr>
            <th>File</th>
            {this.props.existingAttachments
              ? <th width="5%" className="text-center">Select</th>
              : false}
            <th width="5" className="text-right">Remove</th>
          </tr>
        </thead>
        <tbody>
          {this.props.uploads.map(attachment => {
            return (
              <tr key={attachment.id}>
                <td>
                  {this.renderFileLink(attachment)}
                </td>
                {this.renderSelect(attachment)}
                <td className="text-center text-danger">
                  <i
                    onClick={() => this.props.handleDelete(attachment)}
                    className="fa fa-times"
                    style={{ cursor: 'pointer' }}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}
