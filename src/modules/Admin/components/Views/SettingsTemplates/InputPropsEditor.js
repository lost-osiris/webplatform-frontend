import React, {Component} from 'react'
import {Card, Button, Inputs} from '~/components'

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

  /**
   * Renders the table entries for the input props editor based off of the 
   * 
   * @param {Object} entries - Object containing key value pairs representing the input props entered into the "input props" editor.
   */
  renderTableEntries(entries) {
    return Object.keys(entries).map(key => {
      return (
        <tr key={key}>

          <td>
            {key}
          </td>
          <td>
            {this.renderValue(entries[key])}
          </td>
          <td>
            <Button type="button" btnStyle="danger" onClick={() => this.props.handleRemove(key)}>
              Remove
            </Button>
          </td>

        </tr>
      )
    })
  }

  /**
   * Renders the bottom of the "input props" section used for adding
   * new key value props to the list
   */
  renderAddTool() {
    return (
      <div className="row" style={{ marginTop: '25px' }}>
        <div className="col-lg-3" style={{ marginLeft: '25px' }}>
          <Inputs.Text
            placeholder="Enter a key"
            onChange={text => this.setState({ key: text})}
            value={this.state.key}
          />
        </div>
        <div className="col-lg-3">
          <Inputs.Text
            placeholder="Enter a value"
            onChange={text => this.setState({ value: text})}
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
            text="Add"
          >
          </Button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Card>
        <Card.Title className="bg-blue">
          <h4 style={{color: 'white'}}>Input Props</h4>
        </Card.Title>
        <Card.Body>

          <table className="table table-hover">
            <thead>
              <tr>
                <td>Key</td>
                <td>Value</td>
                <td>Remove</td>
              </tr>
            </thead>
            <tbody>
              {this.renderTableEntries(this.props.inputProps)}
            </tbody>
          </table>

          {this.renderAddTool()}

        </Card.Body>
      </Card>
    )
  }
}

export default InputPropsEditor
