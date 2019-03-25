import React, { Component } from 'react'
import _ from 'lodash'
import { Button, Inputs, Form } from '~/components'

class Setting extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  renderDescription(description) {
    return (
      <p>
        {description}
      </p>
    )
  }

  renderSettingRow({ description, input, button, isMulti, name }) {
    return (
      <div>
        <div className="row">
          <div className="col-lg-2">
            {this.renderDescription(description)}
          </div>
          <div className="col-lg-3">
            {input}
          </div>
          <div className="col-lg-2">
            {button}
          </div>
        </div>
        <div className="row">
          {isMulti ? this.renderSelections(name) : <div />}
        </div>
      </div>
    )
  }

  renderTextSettingRow({ description, input, button, name, isMulti }) {
    return (
      <div>
        <div className="row">
          <div className="col-lg-2">
            {this.renderDescription(description)}
          </div>
          <div className="col-lg-4">
            {input}
          </div>
          <div className="col-lg-2">
            {button}
          </div>
        </div>
        <div className="row">
          {isMulti ? this.renderSelections(name) : <div />}
        </div>
      </div>
    )
  }

  renderCheckboxRow(value, checkBox) {
    return (
      <div className="row">
        <div className="col-lg-12">
          {checkBox}
          {value}
        </div>
      </div>
    )
  }

  renderLabel(settingName, text) {
    return (
      <span
        className="label label-primary"
        style={{ marginRight: '5px' }}
        key={`${settingName}-${text}`}
      >
        {text}{' '}
        <i
          className="fa fa-times"
          onClick={() => this.props.onSelectionRemove({ name: settingName, value: text })}
        />
      </span>
    )
  }

  renderSelections(settingName) {
    const { selections } = this.props
    if (selections[settingName] === undefined) {
      return <div />
    }

    return (
      <div className="row">
        <div className="col-lg-12">
          <h4>
            {selections[settingName].map(value => this.renderLabel(settingName, value))}
          </h4>
        </div>
      </div>
    )
  }

  renderSettingInput({ type, description, values, name, isMulti }) {
    const { formProps } = this.props
    switch (type) {
      case 'text': {
        const input = (
          <Form {...formProps}>
            <Inputs.Text data-label={name} />
          </Form>
        )
        return this.renderTextSettingRow({ description, input })
      }
      case 'switch': {
        const input = (
          <Form {...formProps}>
            <Inputs.Switch id={name} />
          </Form>
        )
        return this.renderSettingRow({ description, input })
      }
      case 'radio':
        return (
          <div>
            {this.renderDescription(description)}
            <Form {...this.props.formProps}>
              <Inputs.Radio
                selectedValue={formProps.form[name] || ''}
                itemRenderer={radio =>
                  <div className="row">
                    <div className="col-lg-5">
                      {radio}
                    </div>
                  </div>}
              >
                {values.map(value =>
                  <Inputs.RadioButton key={value} value={value} label={value} id={name} />
                )}
              </Inputs.Radio>
            </Form>
          </div>
        )
      case 'select': {
        let addButton = <div />
        let options = ['', ...values]

        let input = (
          <Inputs.Select
            value={this.state[name] || ''}
            options={options.map(value => ({ value, label: value }))}
            id={name}
            onChange={event => {
              this.setState({ [name]: event.target.value })
            }}
          />
        )

        if (isMulti === true) {
          addButton = (
            <Button
              btnStyle="primary"
              onClick={() => {
                this.props.onSelectionAdd({ name, value: this.state[name] })
                this.setState({ [name]: '' })
              }}
            >
              <i className="zmdi zmdi-plus" />
            </Button>
          )
        } else {
          input = (
            <Form {...formProps}>
              {input}
            </Form>
          )
        }

        return this.renderSettingRow({ description, input, button: addButton, isMulti, name })
      }
      case 'autoComplete': {
        let addButton = <div />

        let input = (
          <Inputs.Autocomplete
            data-label={name}
            data={values}
            ref={name}
            searchText={this.state[name] || ''}
            onChange={result => this.setState({ [name]: result.searchText })}
            {...this.props.setting.inputProps}
          />
        )
        if (isMulti === true) {
          addButton = (
            <Button
              btnStyle="primary"
              onClick={() => {
                this.props.onSelectionAdd({ name, value: this.state[name] })
                this.setState({ [name]: '' })
              }}
            >
              <i className="zmdi zmdi-plus" />
            </Button>
          )
        } else {
          input = (
            <Form {...formProps}>
              {input}
            </Form>
          )
        }
        return this.renderTextSettingRow({ description, input, button: addButton, name, isMulti })
      }
      case 'checkBox': {
        const checkComponent = value =>
          <Inputs.Check
            inline
            style={{ paddingLeft: '5px' }}
            checked={
              (formProps.form[name] !== undefined ? formProps.form[name][value] : false) || false
            }
            onChange={e => this.onCheck(name, value, e.target.checked)}
          />
        return (
          <div>
            {this.renderDescription(description)}
            {values.map(value =>
              <div key={value}>
                {this.renderCheckboxRow(value, checkComponent(value))}
              </div>
            )}
          </div>
        )
      }
    }
  }

  onCheck(name, value, checked) {
    const form = { ...this.props.formProps.form }
    form[name] = {
      ...form[name],
      [value]: checked,
    }

    this.props.formProps.onChange(form)
  }

  render() {
    return (
      <div className="row" style={{ marginTop: '30px' }}>
        <h4>
          <b>
            {_.startCase(this.props.setting.title)}
          </b>
        </h4>
        {this.renderSettingInput({ ...this.props.setting })}
      </div>
    )
  }
}

export default Setting
