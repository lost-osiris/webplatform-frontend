import React, { Component } from 'react'
import { Inputs } from '~/components'
import DragAndDrop from './DragAndDrop'
import AttachmentInfo from './Info'
import UploadList from './UploadList'
import Utils from '~/utils'
import { Button, DropDown } from '~/components'

/**
  Props:
    - db
    - collection
    - keyword (key is a reserved prop for components)
    - object
    - value: objectID returned by the API
    - onChange: component sets the value prop
*/
class Attachment extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()
    this.api = {
      path: 'files.list',
      data: {
        uid: this.utils.getUser().uid,
      },
    }

    this.state = {
      showUploadField: false,
      showExistingAttachements: false,
      existingAttachments: [],
      uploadedFiles: this.props.value !== undefined ? this.props.value : [],
      uploading: false,
      errorUrl: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.uploadedFiles !== this.state.uploadedFiles) {
      this.props.onChange(this.state.uploadedFiles)
    }
  }

  handleBackClick() {
    if (this.state.showExistingAttachements || this.state.showUploadField) {
      this.setState({
        showExistingAttachements: false,
        showUploadField: false,
      })
    }
  }

  handleOnUploadClick() {
    if (
      this.state.showExistingAttachements ||
      this.state.showUploadField ||
      this.state.uploadedFiles.length > 0
    ) {
      return
    }

    this.uploadField.click()
  }

  handleUploadUrlMenuClick() {
    this.setState({
      showUploadField: true,
    })
  }

  handleListAttachmentsMenuClick() {
    this.utils.request(this.api)
    this.utils.getData().then(data => {
      this.setState({
        showExistingAttachements: true,
        existingAttachments: data,
      })
    })
  }

  uploadFiles(files) {
    const filesArr = []
    this.handleFiles(files, file => {
      filesArr.push(file)
    })

    const data = {
      files: filesArr,
      data: {
        db: this.props.db,
        collection: this.props.collections,
        key: this.props.keyword,
        objectType: this.props.objectType,
        id: this.props.id,
      },
    }

    const api = {
      path: 'upload',
      data,
    }

    this.setState({ uploading: true })
    this.utils.request(api).then(data => {
      let uploadedFiles = []
      if (Array.isArray(data)) {
        data.forEach(res => {
          uploadedFiles.push({
            id: res.id,
            filename: res.filename,
          })
        })
      } else {
        uploadedFiles = [
          {
            id: data.id,
            filename: data.filename,
          },
        ]
      }

      this.setState({
        uploadedFiles: [...this.state.uploadedFiles, ...uploadedFiles],
        existingAttachments: [...this.state.existingAttachments, ...uploadedFiles],
        uploading: false,
      })
    })
  }

  handleFiles(files, handler) {
    for (let i = 0; i < files.length; i++) {
      handler(files.item(i))
    }
  }

  handleUploadFromInput(event) {
    this.uploadFiles(event.target.files)
  }

  handleUploadFromDrop(dataTransfer) {
    this.uploadFiles(dataTransfer.files)
  }

  handleDelete(attachment) {
    const api = {
      path: 'files.remove',
      data: {
        id: attachment.id,
      },
      pre: () => {
        this.setState({
          uploading: true,
        })
      },
    }

    this.utils.request(api).then(deletedData => {
      if (deletedData) {
        this.setState({
          existingAttachments: this.findAndDeleteAttachment(
            this.state.existingAttachments,
            attachment
          ),
          uploadedFiles: this.findAndDeleteAttachment(
            this.state.uploadedFiles,
            attachment
          ),
          uploading: false,
        })
      }
    })
  }

  findAttachmentIndex(source, attachment) {
    return source.findIndex(el => {
      return el.id === attachment.id
    })
  }

  findAndDeleteAttachment(source, attachment) {
    const attachmentIndex = this.findAttachmentIndex(source, attachment)
    const updatedFiles = [...source]

    if (attachmentIndex >= 0) {
      updatedFiles.splice(attachmentIndex, 1)
    }

    return updatedFiles
  }

  handleInputURLChange(text) {
    this.setState({
      url: text,
      errorUrl: false,
      placeholder: 'Upload URL',
    })
  }

  handleUrlUpload() {
    if (!this.state.url) {
      this.setState({
        placeholder: 'Please enter a valid URL',
        errorUrl: true,
      })
      return
    }

    const data = {
      data: {
        url: this.state.url,
        db: this.props.db,
        collection: this.props.collections,
        key: this.props.keyword,
        objectType: this.props.objectType,
        id: this.props.id,
      },
    }

    const api = {
      path: 'upload',
      data,
    }

    this.utils.request(api)
    this.utils.getData().then(data => {
      if (!data) {
        this.setState({
          url: '',
          errorUrl: true,
        })
      } else {
        console.log('setting state back')
        this.setState({
          url: '',
          errorUrl: false,
          placeholder: '',
          uploadedFiles: [
            ...this.state.uploadedFiles,
            {
              url: data.url,
              id: data.id,
              filename: data.filename,
            },
          ],
        })
      }
    })
  }

  handleSelect(attachment, selected) {
    const uploadIndex = this.findAttachmentIndex(this.state.uploadedFiles, attachment)

    let nextState = {}

    // should be added to the uploaded list
    if (selected) {
      if (uploadIndex < 0) {
        nextState = {
          uploadedFiles: [...this.state.uploadedFiles, attachment],
        }
      }
    } else {
      // should be removed from the uploaded list
      if (uploadIndex < 0) {
        return
      }

      const updatedFiles = [...this.state.uploadedFiles]
      updatedFiles.splice(uploadIndex, 1)
      nextState = { uploadedFiles: updatedFiles }
    }

    this.setState(nextState)
  }

  renderUploads(uploads, field) {
    return (
      <UploadList
        uploads={uploads}
        existingAttachments={field === 'existingAttachments'}
        uploadedFiles={this.state.uploadedFiles}
        handleSelect={this.handleSelect.bind(this)}
        handleDelete={this.handleDelete.bind(this)}
      />
    )
  }

  renderExistingAttachments() {
    const attachments = this.state.existingAttachments.filter(file => !file.isAttach)

    return this.renderUploads(attachments, 'existingAttachments')
  }

  renderURLUpload() {
    console.log('rendering url with state:', this.state)
    const uploadFieldStyle = this.state.showUploadField ? {} : { display: 'none' }
    return (
      <div style={{ paddingTop: '8px' }}>
        {this.renderUploads(this.state.uploadedFiles, 'uploadedFiles')}
        <div className="row" style={uploadFieldStyle}>
          <div className="col-lg-11">
            <Inputs.Text
              error={this.state.errorUrl || false}
              placeholder={this.state.placeholder || 'Upload URL...'}
              value={this.state.url || ''}
              onChange={e => {
                this.handleInputURLChange(e)
              }}
            />
          </div>
          <div className="col-lg-1 text-right col-height col-middle">
            <Button
              btnStyle="primary"
              onClick={() => this.handleUrlUpload()}
            >
              <i className="fa fa-plus" />
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 text-danger text-center">
            {this.state.errorUrl ? 'Failed to upload the URL.' : ''}
          </div>
        </div>
      </div>
    )
  }

  renderUploadField() {
    let component
    this.uploadField = React.createRef()

    if (this.state.showExistingAttachements) {
      component = this.renderExistingAttachments()
    } else if (this.state.showUploadField) {
      component = this.renderURLUpload()
    } else {
      if (this.state.uploadedFiles.length) {
        component = this.renderUploads(this.state.uploadedFiles, 'uploadedFiles')
      } else {
        component = (
          <div>
            <h2 className="text-center">
              Drag to upload or click to open file browser...
            </h2>
            <input
              ref={input => this.uploadField = input}
              type="file"
              name="fileUpload"
              id="file"
              style={{ display: 'none' }}
              onChange={e => this.handleUploadFromInput(e)}
            />
          </div>
        )
      }
    }

    return component
  }

  renderTopButton() {
    if (this.state.showExistingAttachements || this.state.showUploadField) {
      return (
        <Button
          icon='zmdi zmdi-arrow-left'
          btnStyle='primary'
          onClick={ () => this.handleBackClick() }
        />
      )
    }

    return (
      <DropDown
        icon="zmdi zmdi-menu text-white"
        color="blue"
      >
        <DropDown.Item onMouseDown={() => this.handleUploadUrlMenuClick()}>
          <i className="zmdi zmdi-link pr-2" />
          Upload URL
        </DropDown.Item>
        <DropDown.Item onMouseDown={() => this.handleListAttachmentsMenuClick()}>
          <i className="zmdi zmdi-folder pr-2" />
          List Existing Attachments
        </DropDown.Item>
      </DropDown>
    )
  }

  render() {
    let content = [
      <div className="row" key="attachment-dropdown">
        <div className="col text-right" key="dropdownmenu-file" style={{}}>
          {this.renderTopButton()}
        </div>
      </div>,
      <DragAndDrop
        key="dragndrop-file"
        onDrop={dataTransfer => this.handleUploadFromDrop(dataTransfer)}
        onClick={() => this.handleOnUploadClick()}
      >
        <div className="col-lg-12" style={{ paddingTop: '32px' }}>
          {this.renderUploadField()}
        </div>
      </DragAndDrop>,
    ]

    if (this.state.uploading) {
      content = <span />
    }

    return (
      <div className="row">
        <div className="row-height">
          <div className="col-lg-8 col-height col-top">
            <div
              className="row jumbotron inside-full-height"
              style={{ padding: '20px' }}
            >
              <div className="col">
                {content}
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-height">
            <AttachmentInfo />
          </div>
        </div>
      </div>
    )
  }
}

export default Attachment
