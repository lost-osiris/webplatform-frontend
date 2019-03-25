import React, { Component } from 'react'
import { Card } from '~/components'

export default class AttachmentInfo extends Component {
  render() {
    return (
      <Card style={{ marginBottom: 0 }}>
        <Card.Title className="bg-blue" style={{ padding: '15px 17px' }}>
          <h4>
            <i className="text-white">Info</i>
          </h4>
        </Card.Title>
        <Card.Body className="card-padding">
          <span>
            Please note when you drag/select/enter a file or URL, it is
            immediately uploaded.
            When you submit your form the uploaded files and links are then
            associated with the object you are submitting.
            <br />
            <br />
            <p className="text-danger">
              Additionally, if you remove a file from the uploader it is removed
              from our database.
              So if this form is for editing an object, you will remove the
              files even if you do not submit the form. Please remove files
              cautiously.
            </p>
          </span>
        </Card.Body>
      </Card>
    )
  }
}
