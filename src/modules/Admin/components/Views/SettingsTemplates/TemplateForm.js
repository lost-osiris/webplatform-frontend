import React, { Component } from 'react'
import _ from 'lodash'
import { Card, Button, Inputs, Form, Collapse, Label, Utils } from 'webplatform-ui'
import ValuesEditor from './ValuesEditor'
import InputPropsEditor from './InputPropsEditor'
import { connect } from 'react-redux'

class AddTemplate extends Component {
  constructor(props) {
    super(props)

    console.log('EEEEEEEEEEEEEEEE', props)
    this.utils = new Utils()

    this.initForm = {
      title: '',
      isGlobal: false,
      isDynamic: false,
      isMulti: false,
      db: '',
      collection: '',
      key: '',
      api: '',
      description: '',
      inputType: '',
      application: '',
      section: '',
      permissions: '',
      inputProps: {}
    }

    this.apis = this.utils.getSystemInfo().modules
    
    if (props.template !== undefined) {
      this.initForm = {...this.initForm, ...props.template}
    }

    this.arrayInputTypes = ['select', 'radio', 'checkBox']
    this.formErrors = {}

    const values = props.type === 'edit' ? props.template.values : []
    const inputProps = props.type === 'edit' ? props.template.inputProps : {}

    let dynamic = false
    // Template should be defined if editing
    if (this.props.template) {
      // Set the state of the forms "dynamic" property to mimic the provided template on props
      dynamic = this.props.template.isDynamic
    }
    
    this.state = {
      values: (values || []),
      inputProps: (inputProps || {}),
      isDynamic: dynamic,
    }
  }

  handleChange(form) {
    if (form.isDynamic !== this.state.isDynamic) {
      this.setState({isDynamic: form.isDynamic})
    }
    if (form.inputProps !== this.state.inputProps) {
      this.setState({inputProps: form.inputProps})
    }
  }

  handleSubmit(form) {
    const errorCount = this.checkForm()

    if (errorCount > 0) {
      this.forceUpdate()
    } else {
      // const template = this.createTemplate(this.formData)
      const template = this.createTemplate(form)
      this.props.submit(template)
    }
  }

  createTemplate(form) {
    const template = {...form}
    if (!form.isDynamic) {
      delete template.db
      delete template.collection
      delete template.key
      delete template.api
    }

    if (this.arrayInputTypes.includes(form.inputType)) {
      template.values = this.state.values
    }

    if (Object.keys(this.state.inputProps).length > 0) {
      template.inputProps = this.state.inputProps
    }

    // if (this.formData.permissions !== undefined && this.formData.permissions !== '') {
    // if (this.state.form.permissions !== undefined && this.state.form.permissions !== '') {
    if (this.props.form.permissions !== undefined && this.props.form.permissions !== '') {
      template.permissions = this.createPermissions()
    } else {
      delete template.permissions
    }

    return template
  }

  createPermissions() {
    // return this.formData.permissions.split(',').map(perm => perm.trim())
    // return this.state.form.permissions.split(',').map(perm => perm.trim())
    return this.props.form.permissions.split(',').map(perm => perm.trim())
  }

  checkForm(form) {
    const errors = {
      title: false,
      description: false,
      inputType: false,
      application: false,
      section: false,
      isDynamic: false,
    }

    Object.keys({...errors}).forEach(key => {
      if (key === 'isDynamic' && form[key]) {
        if (form.api == undefined || form.api == '') {
          ['db', 'collection', 'key'].forEach(key => {
            // if (!this.formData[key]) {
            if (!form[key]) {
              errors[key] = true
            }
          })
        } else {
          if (!(form.api != undefined && form.api != '')) {
            errors[key] = true
          }
        }
      } else {
        const value = form[key]
        if (value === undefined || value === '') {
          errors[key] = true
        }
      }
    })

    return errors
  }

  renderValues() {
    const {isDynamic, inputType} = this.initForm

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

  /**
   * Render the input props editor located at the bottom
   * of the page. Allows for specification of a key and value
   * for the desired key.
   */
  renderInputPropEditor() {
    // Set default values in case form is not fully initialized
    let inputProps = {}
    const action = {
      name: 'settings-add-template',
      id: 'inputProps',
      value: {} 
    }

    // If form has been initialized, set appropriate values
    if (this.props.form) {
      action.value = {...this.props.form.inputProps}
      inputProps = this.props.form.inputProps
    }

    return (
      <InputPropsEditor
        inputProps={inputProps}
        handleAdd = {(key, val) => {
          action.value[key] = val 
          this.utils.dispatch('FORM_VALUE_UPDATE', action)
        }}
        handleRemove={(key) => {
          action.value = _.omit(action.value,  key)
          this.utils.dispatch('FORM_VALUE_UPDATE', action)
        }}
      />
    )
  }

  /**
   * Returns the magnitude/count of how many errors are present in the supplied
   * error object
   * 
   * @param {Object} errors - Object of errors. Keys represent component, value true if error, false if not
   */
  getErrorCount(errors) {
    let count = 0
    for (var error of Object.keys(errors)) {
      // Increment counter if error present
      errors[error] ? count++ : null 
    }
    
    return count
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

    console.log('RENDERING ADD - Props:', this.props)

    const newHandleSubmit = (form) => {
      const template = this.createTemplate(form)
      const  errors = this.checkForm(form)

      // If no errors are present, submit to api
      if (this.getErrorCount(errors) === 0) {
        console.log('NO ERRORS, Submitting template - ', template)
        this.props.submit(template)
      }
      return errors 
    }

    const form = {
      onChange: form => this.handleChange(form),
      onSubmit: (form) => newHandleSubmit(form),
      form: this.initForm,
      name: this.props.name
    }

    console.log(form)

    const rowStyle = {marginTop: '15px', marginBottom: '15px'}
    
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
          <Form {...form}>
            <div className="row" style={rowStyle}>
              <div className="col-lg-3">
                <Label form={this.props.name} id="title">Title</Label>
                <Inputs.Text form={this.props.name} id="title" />
              </div>
              <div className="col-lg-2">
                <Inputs.Switch form={this.props.name} id="isGlobal" label="Global" />
              </div>
              <div className="col-lg-2">
                <Inputs.Switch form={this.props.name}id="isDynamic" label="Dynamic" />
              </div>
              <div className="col-lg-2">
                <Inputs.Switch form={this.props.name} id="isMulti" label="Multi" />
              </div>
            </div>
            <Collapse>
              <Collapse.Item collapsed={!this.state.isDynamic}>
                {/* <Collapse.Header>
                </Collapse.Header> */}
                <Collapse.Body>
                  <div className="row" style={rowStyle}>
                    <div className="col-lg-3">
                      <Inputs.Text form={this.props.name} id="db" data-label="db" placeholder="Database..." />
                    </div>
                    <div className="col-lg-3">
                      <Inputs.Text form={this.props.name} id="collection" data-label="collection" placeholder="Database Collection..." />
                    </div>
                    <div className="col-lg-3">
                      <Inputs.Text form={this.props.name} id="key" data-label="key" placeholder="Document Key..." />
                    </div>
                    <div className="col-lg-3">
                      <Inputs.Autocomplete
                        type="modules"
                        placeholder="API module..."
                        minSearch={1}
                        form={this.props.name}
                        id="api"
                      />
                    </div>
                  </div>
                </Collapse.Body>
              </Collapse.Item>
            </Collapse>
            <div className="row" style={rowStyle}>
              <div className="col-lg-12">
                <Label form={this.props.name} id="description">Description</Label>
                <Inputs.Text
                  type="textarea"
                  rows="5"
                  data-label="description"
                  placeholder="Enter description here"
                  form={this.props.name}
                  id="description"
                />
              </div>
            </div>
            <div className="row" style={rowStyle}>
              <div className="col-lg-4">
                <Label form={this.props.name} id="inputType">Type</Label>
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
                  form={this.props.name}
                  id="inputType"
                />
              </div>
              <div className="col-lg-4">
                <label form={this.props.name} id="application">Application</label>
                <Inputs.Autocomplete
                  // ref="application"
                  minSearch={1}
                  data={this.props.applications}
                  // data-label="application"
                  // searchText={this.formData.application}
                  searchKey={'name'}
                  form={this.props.name}
                  id="application"
                />
              </div>
              <div className="col-lg-4">
                <Label form={this.props.name} id="section">Section</Label>
                <Inputs.Select
                  options={[
                    {value: '', label: ''},
                    {value: 'general', label: 'general'},
                    {value: 'notifications', label: 'notifications'},
                    {value: 'advanced', label: 'advanced'},
                  ]}
                  id="section"
                  form={this.props.name}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <label id="permissions">Permissions</label>
                <Inputs.Text
                  data-label="permissions"
                  placeholder="Enter permissions"
                  form={this.props.name}
                  id="permissions"
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
            <Button btnStyle="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    )
  }
}

const mapStateToProps = (state, props) => {
  let name = `settings-${props.type}-template`

  const { dashboard } = state
  const form = dashboard.form[name]
  return {form: form, name:name}
}

export default connect(mapStateToProps)(AddTemplate)
