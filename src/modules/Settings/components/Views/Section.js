import React, { Component } from 'react'
import { Button } from '~/components'
import Utils from '~/utils'
import Setting from './Setting'
import _ from 'lodash'

class Section extends Component {
  constructor(props) {
    super(props)
    this.formData = {}
    this.selections = {}
    this.initializeForm(this.formData)
    this.initializeSelections(this.selections)
    this.utils = new Utils()
    this.state = {
      selections: this.initializeSelections(),
    }
  }

  initializeForm(form) {
    const { applicationSettings, settings } = this.props
    Object.keys(applicationSettings).forEach(app => {
      applicationSettings[app].forEach(setting => {
        const { name } = setting
        if (settings[app] !== undefined && settings[app][name] !== undefined) {
          form[name] = this.getSettingValue({ app, ...setting, settings })
        }
      })
    })
  }

  getSettingValue({ app, name, type, isMulti, settings }) {
    const values = settings[app][name]
    if (isMulti) {
      return values
    } else {
      if (type === 'checkBox') {
        const checked = {}
        values.forEach(value => {
          checked[value] = true
        })

        return checked
      } else {
        return values[0]
      }
    }
  }

  initializeSelections() {
    const selections = {}
    const { applicationSettings, settings } = this.props
    Object.keys(applicationSettings).forEach(app => {
      applicationSettings[app].filter(setting => setting.isMulti === true).forEach(setting => {
        const { name } = setting
        if (settings[app] !== undefined && settings[app][name] !== undefined) {
          selections[name] = this.getSettingValue({ app, ...setting, settings })
        }
      })
    })

    return selections
  }

  handleChange(form) {
    this.formData = { ...this.formData, ...form }
    this.forceUpdate()
  }

  renderAppSettings(settings, formProps) {
    return settings.map(setting =>
      <Setting
        key={setting.name}
        setting={setting}
        formProps={formProps}
        onSelectionAdd={({ name, value }) => this.handleSelectionAdd({ name, value })}
        onSelectionRemove={({ name, value }) => this.handleSelectionRemove({ name, value })}
        selections={this.state.selections}
      />
    )
  }

  handleSubmit() {
    const settings = Object.keys({ ...this.formData, ...this.state.selections }).map(key => {
      let value

      if (this.state.selections[key] !== undefined) {
        value = this.state.selections[key]
      } else {
        value = this.formData[key]
      }

      return {
        name: key,
        value,
      }
    })

    const api = {
      path: 'settings.update',
      data: {
        settings,
      },
    }

    // this.utils.request(api).then(() => History.go('/settings'))
    this.utils.request(api)
  }

  handleSelectionAdd({ name, value }) {
    this.setState({
      selections: {
        ...this.state.selections,
        [name]: [...(this.state.selections[name] || []), value],
      },
    })
  }

  handleSelectionRemove({ name, value }) {
    const removedSelections = (this.state.selections[name] || [])
      .filter(selection => selection !== value)
    this.setState({ selections: { ...this.state.selections, [name]: removedSelections } })
  }

  render() {
    const formProps = {
      onChange: form => this.handleChange(form),
      form: this.formData,
      onSubmit: () => this.handleSubmit(),
      selections: this.selections,
    }

    const { applicationSettings, applicationTitles } = this.props

    return (
      <div>
        {Object.keys(applicationSettings).map(app =>
          <div key={app} style={{ marginLeft: '10px' }}>
            <div className="row">
              <h3>
                <a id={app} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <b>
                    {applicationTitles[app] || _.startCase(app)}
                  </b>
                </a>
              </h3>
            </div>
            <div style={{ marginLeft: '40px' }}>
              {this.renderAppSettings(applicationSettings[app], formProps)}
            </div>
          </div>
        )}
        <div className="row" style={{ marginTop: '20px', marginLeft: '30px' }}>
          {Object.keys(applicationSettings).length > 0
            ? <Button btnStyle="primary" onClick={() => this.handleSubmit()}>
                Save
              </Button>
            : <div />}
        </div>
      </div>
    )
  }
}

export default Section
