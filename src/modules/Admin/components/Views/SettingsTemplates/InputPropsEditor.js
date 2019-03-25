import React, {Component} from 'react'
import {Button, Inputs} from '~/components'

class InputPropsEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      key: '',
      value: '',
    }
  }

  getData(str) {
    let data
    try {
      data = JSON.parse(str)
    } catch (e) {
      return data = str
    }

    return data
  }

  renderValue(value) {
    if (typeof value === 'object') {
      return <pre>{JSON.stringify(value)}</pre>
    } else {
      return value
    }
  }

  render() {
    const {inputProps} = this.props
    return (
      <div className="card" style={{minHeight: '300px'}}>
        <div className="card-header bgm-blue c-white">
          <h4 style={{color: 'white'}}>Input Props</h4>
        </div>
        <div className="card-body card-padding">
          <table className="table table-hover">
            <thead>
              <tr>
                <td>Key</td>
                <td>Value</td>
                <td>Remove</td>
              </tr>
            </thead>
            <tbody>
              {Object.keys(inputProps).map(key =>
                <tr key={key}>
                  <td>
                    {key}
                  </td>
                  <td>
                    {this.renderValue(inputProps[key])}
                  </td>
                  <td>
                    <Button btnStyle="danger" onClick={() => this.props.handleRemove(key)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="row" style={{ marginTop: '25px' }}>
            <div className="col-lg-3" style={{ marginLeft: '25px' }}>
              <Inputs.Text
                placeholder="Enter a key"
                onChange={e => this.setState({ key: e.target.value })}
                value={this.state.key}
              />
            </div>
            <div className="col-lg-3">
              <Inputs.Text
                placeholder="Enter a value"
                onChange={e => this.setState({ value: e.target.value })}
                value={this.state.value}
              />
            </div>
            <div className="col-lg-2" style={{ marginLeft: '25px' }}>
              <Button
                btnStyle="primary"
                onClick={() => {
                  this.props.handleAdd(this.state.key, this.getData(this.state.value))
                  this.setState({ key: '', value: '' })
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default InputPropsEditor
