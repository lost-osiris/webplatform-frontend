import React from 'react'
import { Button, Inputs } from '~/components'
import _ from 'lodash'

class JobParams extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      key: '',
      valueType: '',
      value: '',
      errors: {
        key: false,
        valueType: false,
        value: false,
      },
    }
  }

  checkType(type, value) {
    if (type === 'text') {
      return _.isString(value)
    } else if (type === 'number') {
      return !isNaN(value)
    } else {
      return true
    }
  }

  handleChange(key, event) {
    this.setState({
      [key]: event.target.value,
    })
  }

  handleAdd() {
    const keys = ['key', 'valueType', 'value']
    const errors = {}
    let errorCount = 0
    keys.forEach(key => {
      if (!this.state[key]) {
        errors[key] = true
        errorCount++
      }
    })

    if (errorCount > 0) {
      this.setState({ errors })
      return
    }

    if (!this.checkType(this.state.valueType, this.state.value)) {
      this.setState({
        errors: {
          value: true,
        }
      })

      return
    }

    const newParams = {
      ...this.props.params,
      [this.state.key]: this.getValue(this.state.valueType, this.state.value),
    }

    this.props.onChange(newParams)

    this.setState({
      key: '',
      value: '',
      valueType: '',
      errors: {
        key: '',
        value: '',
        valueType: '',
      }
    })
  }

  getValue(type, str) {
    if (type === 'list') {
      return this.toArray(str)
    } else if (type === 'number') {
      return parseInt(str, 10)
    } else {
      return str
    }
  }

  toArray(value) {
    const tokens = value.split(',')
    return tokens.map(token => _.trim(token))
  }

  handleRemove(key) {
    const newParams = { ...this.props.params }
    delete newParams[key]

    this.props.onChange(newParams)
  }

  createParamComponent() {
    var body = Object.keys(this.props.params).map(key => {
      return (
        <tr key={key}>
          <td>{key}</td>
          <td>{JSON.stringify(this.props.params[key])}</td>
          <td>
            <Button
              btnStyle="danger"
              onClick={() => this.handleRemove(key)}
            >
              Remove
            </Button>
          </td>
        </tr>
      )
    })

    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <td>Key</td>
            <td>Value</td>
            <td>Remove</td>
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    )
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-8">
          <div
            className="card"
            style={{
              minHeight: '300px',
            }}
          >
            <div className="card-header bgm-blue c-white">
              <h4
                style={{
                  color: 'white',
                }}
              >
                Parameters
              </h4>
            </div>
            <div className="card-body card-padding">
              {this.createParamComponent()}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="row">
            <div className="col-lg-12">
              <Inputs.Text
                placeholder="Enter key here"
                onChange={e => this.handleChange('key', e)}
                value={this.state.key}
                error={this.state.errors['key']}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-12">
              <Inputs.Text
                placeholder="Enter value here"
                value={this.state.value || ''}
                onChange={e => this.handleChange('value', e)}
                error={this.state.errors['value']}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-4" style={{ marginTop: '10px' }}>
              <label>Value Type:</label>
            </div>
            <div
              className={`col-lg-8${this.state.errors['valueType'] ? ' has-error' : ''}`}
            >
              <select
                className="form-control"
                onChange={e => this.handleChange('valueType', e)}
                value={this.state.valueType}
              >
                <option />
                <option value="text">
                  text
                </option>
                <option value="number">
                  number
                </option>
                <option value="list">
                  list
                </option>
              </select>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-12">
              <Button
                btnStyle="primary"
                onClick={() => this.handleAdd()}
              >
                Edit Parameter
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default JobParams
