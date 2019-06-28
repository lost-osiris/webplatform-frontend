import React, {Component} from 'react'
import {Card, Button, Inputs} from '~/components'

class ValuesEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
    }
  }

  render() {
    return (
      // <div className="card" style={{minHeight: '300px'}}>
      <Card>
        <Card.Title>
          <h4 style={{color: 'white'}}>Values</h4>
        </Card.Title>
        <Card.Body>
          <table className="table table-hover">
            <thead>
              <tr>
                <td>Value</td>
                <td>Remove</td>
              </tr>
            </thead>
            <tbody>
              {this.props.values.map((value, index) =>
                (<tr key={`${value}-${index}`}>
                  <td>
                    {value}
                  </td>
                  <td>
                    <Button
                      btnStyle="danger"
                      onClick={() => this.props.handleRemove(index)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>)
              )}
            </tbody>
          </table>
          <div className="row" style={{ marginTop: '25px' }}>
            <div className="col-lg-5" style={{marginLeft: '25px'}}>
              <Inputs.Text
                placeholder="Enter a value"
                onChange={e => this.setState({value: e.target.value})}
                value={this.state.value}
              />
            </div>
            <div className="col-lg-2">
              <Button
                btnStyle="primary"
                onClick={() => {
                  this.props.handleAdd(this.state.value)
                  this.setState({
                    value: '',
                  })
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    )
  }
}

export default ValuesEditor
