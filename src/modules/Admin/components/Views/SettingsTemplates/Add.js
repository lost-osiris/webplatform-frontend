import React, { Component } from 'react'
import _ from 'lodash'
import Utils from '~/utils'
import { Card, Button, Inputs, Form, Collapse } from '~/components'
import ValuesEditor from './ValuesEditor'
import InputPropsEditor from './InputPropsEditor'

class AddTemplate extends Component {
  constructor(props) {
    super(props)

    this.utils = new Utils()

    if (props.template !== undefined) {
      this.formData = {...props.template}
    } else {
      this.formData = {
        isGlobal: false,
        isDynamic: false,
        isMulti: false,
        application: '',
      }

      this.apis = this.utils.getSystemInfo().modules
    }

    this.arrayInputTypes = ['select', 'radio', 'checkBox']
    this.formErrors = {}

    const values = props.type === 'edit' ? props.template.values : []
    const inputProps = props.type === 'edit' ? props.template.inputProps : {}

    this.state = {
      values: (values || []),
      inputProps: (inputProps || {}),
    }
  }

  handleChange(form) {
    this.formData = form
    this.forceUpdate()
  }

  handleSubmit() {
    const errorCount = this.checkForm()

    if (errorCount > 0) {
      this.forceUpdate()
    } else {
      const template = this.createTemplate(this.formData)
      this.props.submit(template)
    }
  }

  createTemplate(form) {
    const template = {...form}
    if (!form.isDynamic) {
      delete template.db
      delete template.collection
      delete template.key
    }

    if (this.arrayInputTypes.includes(form.inputType)) {
      template.values = this.state.values
    }

    if (Object.keys(this.state.inputProps).length > 0) {
      template.inputProps = this.state.inputProps
    }

    if (this.formData.permissions !== undefined && this.formData.permissions !== '') {
      template.permissions = this.createPermissions()
    } else {
      delete template.permissions
    }

    return template
  }

  createPermissions() {
    return this.formData.permissions.split(',').map(perm => perm.trim())
  }

  checkForm() {
    const errors = {
      title: false,
      description: false,
      inputType: false,
      application: false,
      section: false,
      isDynamic: false,
    }
    let errorCount = 0

    Object.keys({...errors}).forEach(key => {
      if (key === 'isDynamic' && this.formData[key]) {
        if (this.formData.api == undefined || this.formData.api == '') {
          ['db', 'collection', 'key'].forEach(key => {
            if (!this.formData[key]) {
              errors[key] = true
              errorCount += 1
            }
          })
        } else {
          if (!(this.formData.api != undefined && this.formData.api != '')) {
            errors[key] = true
            errorCount += 1
          }
        }
      } else {
        const value = this.formData[key]
        if (value === undefined || value === '') {
          errors[key] = true
          errorCount += 1
        }
      }
    })

    this.formErrors = errors
    return errorCount
  }

  renderValues() {
    const {isDynamic, inputType} = this.formData

    if (!isDynamic && (this.arrayInputTypes.includes(inputType))) {
      return (
        <ValuesEditor
          values={this.state.values}
          handleRemove={(index) => this.setState({
            values: this.state.values.filter((value, idx) => idx !== index),
          })}
          handleAdd={(value) => this.setState({
            values: [...this.state.values, value],
          })}
        />
      )
    } else {
      return <div />
    }
  }

  renderInputPropEditor() {
    return (
      <InputPropsEditor
        inputProps={this.state.inputProps}
        handleAdd={(key, val) => this.setState({
          inputProps: {
            ...this.state.inputProps,
            [key]: val,
          }
        })}
        handleRemove={(key) => this.setState({
          inputProps: _.omit(this.state.inputProps, key)
        })}
      />
    )
  }

  renderForm() {
    this.handleAutocomplete = result => {
      this.formData.api = result.searchText
      this.forceUpdate()
    }

    const form = {
      onChange: form => this.handleChange(form),
      onSubmit: () => this.handleSubmit(),
      form: this.formData,
      error: this.formErrors,
    }

    const rowStyle = {marginTop: '15px', marginBottom: '15px'}

    return (
      <Form {...form}>
        <div className="row" style={rowStyle}>
          <div className="col-lg-3">
            <label id="title">Title</label>
            <Inputs.Text data-label="title" />
          </div>
          <div className="col-lg-2">
            <label id="isGlobal">Global</label>
            <Inputs.Switch id="isGlobal" />
          </div>
          <div className="col-lg-2">
            <label id="isDynamic">Dynamic</label>
            <Inputs.Switch id="isDynamic" />
          </div>
          <div className="col-lg-2">
            <label id="isMulti">Multi</label>
            <Inputs.Switch id="isMulti" />
          </div>
        </div>
        <Collapse collapsed={this.formData.isDynamic}>
          <div className="row" style={rowStyle}>
            <div className="col-lg-3">
              <Inputs.Text data-label="db" placeholder="Database..." />
            </div>
            <div className="col-lg-3">
              <Inputs.Text data-label="collection" placeholder="Database Collection..." />
            </div>
            <div className="col-lg-3">
              <Inputs.Text data-label="key" placeholder="Document Key..." />
            </div>
            <div className="col-lg-3">
              <Inputs.Autocomplete
                placeholder="API module..."
                minSearch={1}
                data={this.apis}
                onChange={this.handleAutocomplete}
                searchText={this.formData.api}
                isObject={true}
                data-label="api"
              />
            </div>
          </div>
        </Collapse>
        <div className="row" style={rowStyle}>
          <div className="col-lg-12">
            <label id="description">Description</label>
            <Inputs.Text
              type="textarea"
              rows="5"
              data-label="description"
              placeholder="Enter description here"
            />
          </div>
        </div>
        <div className="row" style={rowStyle}>
          <div className="col-lg-4">
            <label id="inputType">Type</label>
            <Inputs.Select
              options={[
                {value: '', label: ''},
                {value: 'autoComplete', label: 'AutoComplete'},
                {value: 'switch', label: 'Switch'},
                {value: 'select', label: 'Select'},
                {value: 'radio', label: 'Radio'},
                {value: 'checkBox', label: 'Checkbox'},
                {value: 'text', label: 'Text'},
              ]}
              id="inputType"
            />
          </div>
          <div className="col-lg-4">
            <label id="application">Application</label>
            <Inputs.Autocomplete
              ref="application"
              minSearch={1}
              data={this.props.applications}
              data-label="application"
              searchText={this.formData.application}
              searchKey={'name'}
            />
          </div>
          <div className="col-lg-4">
            <label id="section">Section</label>
            <Inputs.Select
              options={[
                {value: '', label: ''},
                {value: 'general', label: 'general'},
                {value: 'notifications', label: 'notifications'},
                {value: 'advanced', label: 'advanced'},
              ]}
              id="section"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <label id="permissions">Permissions</label>
            <Inputs.Text
              data-label="permissions"
              placeholder="Enter permissions"
            />
          </div>
        </div>
        <div className="row" style={{ marginTop: '25px' }}>
          <div className="row-height">
            <div className="col-lg-6 col-height">
              {this.renderInputPropEditor()}
            </div>
            <div className="col-lg-6 col-height">
              {this.renderValues()}
            </div>
          </div>
        </div>
        <Button btnStyle="primary" onClick={() => this.handleSubmit()}>
          Submit
        </Button>
      </Form>
    )
  }

  renderClose() {
    return (
      <Button
        icon
        color="bgm-black"
        otherClasses="c-red"
        onClick={() => this.props.close()}
      >
        <i className="zmdi zmdi-close" />
      </Button>
    )
  }

  render() {
    return (
      <Card>
        <Card.Title>
          <div className="row">
            <div className="col-lg-4">
              <h3>{this.props.type === 'edit' ? 'Edit' : 'Add'} Template</h3>
            </div>
            <div className="col-lg-8 text-right">
              {this.props.type === 'edit' ? this.renderClose() : <div />}
            </div>
          </div>
        </Card.Title>
        <Card.Body>
          {this.renderForm()}
        </Card.Body>
      </Card>
    )
  }
}

export default AddTemplate
