import React from 'react'

import { Inputs, Collapse, Button } from '~/components'
import Utils from '~/utils'

export default class AhyderContainer extends React.Component {
  constructor(props) {
    super(props)

    this.utils = new Utils('permissions.application')

    this.state = {
      userValue: '',
      apiValue: '',
      checked: false
    }

    this.searchText = ''
  }

  getUsersResults(results) {
    if (this.state.userValue != results.searchText) {
      this.setState({userValue: results.searchText})
    }
  }

  getApiResults(results) {
    if (this.state.apiValue != results.searchText) {
      this.setState({apiValue: results.searchText})
    }
  }

  toggleChecked(e) {
    this.setState({checked: e})
  }

  render() {
    return (
      <div>
        <div>
          <Inputs.Autocomplete
            type="user"
            placeholder="Enter username..."
            // minSearch={3}
            // data={this.props.users}
            // searchKey="uid"
            searchText={this.state.userValue}
            onChange={results => this.getUsersResults(results)}
          />
          <Button
            text="^GetValue^"
            onClick={() => console.log('user value: ', this.state.userValue)}
          />
        </div>
        <br />
        <div>
          <Inputs.Autocomplete
            type="modules"
            placeholder="API module..."
            searchText={this.state.apiValue}
            minSearch={3}
            onChange={results => this.getApiResults(results)}
          />
          <Button
            text="^GetValue^"
            onClick={() => console.log('api value: ', this.state.apiValue)}
          />
        </div>
        <br />
        <Inputs.Check
          checked = {this.state.checked}
          inline
          onChange={(e) => this.toggleChecked(e)}
          label="ye"
        />
        <br />
        <Button
          text="^GetValue^"
          onClick={() => console.log('check value: ', this.state.checked)}
        />

        <h4>Claps</h4>
        <Collapse>
          <Collapse.Item>
            <Collapse.Header>
              A test
            </Collapse.Header>
            <Collapse.Body>
              A bunch of text to be hidden and shown accordingly via the collapse component
            </Collapse.Body>
          </Collapse.Item>
          <Collapse.Item>
            <Collapse.Header>
              A second test
            </Collapse.Header>
            <Collapse.Body>
              A bunchlasdjflasjfl aslkafdsjfj laksj of text to be hidden and shown accordingly via the collapse component
            </Collapse.Body>
          </Collapse.Item>
        </Collapse>
      </div>
    )
  }
}
