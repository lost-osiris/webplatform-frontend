import React from 'react'

import { Inputs, Form, Button, Label } from '~/components'
import Utils from '~/utils'

export default class AhyderContainer extends React.Component {
  constructor(props) {
    super(props)

    this.utils = new Utils('permissions.application')

    this.state = {
      userValue: '',
      apiValue: '',
      text: '',
      data: [
        {'city': 'Abbeville', 'state': 'Louisiana'},
        {'city': 'Aberdeen', 'state': 'Maryland'},
        {'city': 'Aberdeen', 'state': 'Mississippi'},
        {'city': 'Aberdeen', 'state': 'South Dakota'},
        {'city': 'Aberdeen', 'state': 'Washington'},
        {'city': 'Abilene', 'state': 'Texas'},
        {'city': 'Abilene', 'state': 'Kansas'},
        {'city': 'Abingdon', 'state': 'Virginia'},
        {'city': 'Abington', 'state': 'Massachusetts'},
        {'city': 'Absecon', 'state': 'New Jersey'},
        {'city': 'Accokeek', 'state': 'Maryland'},
        {'city': 'Acton', 'state': 'Massachusetts'},
        {'city': 'Acushnet', 'state': 'Massachusetts'},
        {'city': 'Acworth', 'state': 'Georgia'},
        {'city': 'Ada', 'state': 'Oklahoma'},
        {'city': 'Adams', 'state': 'Massachusetts'},
        {'city': 'Addison', 'state': 'Illinois'},
        {'city': 'Addison', 'state': 'Texas'},
        {'city': 'Adelanto', 'state': 'California'},
        {'city': 'Adelphi', 'state': 'Maryland'},
        {'city': 'Adrian', 'state': 'Michigan'},
        {'city': 'Affton', 'state': 'Missouri'}, 
      ]
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

  handleSubmit(form) {
    console.log(form)
    return {input: true}
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <h2>Autocomplete</h2>
        {/* <Form name="testing" form={{input: ''}} onSubmit={(form) => this.handleSubmit(form)}>
          <Label form="testing" id="input">Enter a User</Label>
          <Inputs.Autocomplete 
            placeholder="Enter a user..."
            minSearch={3}
            data={this.state.data}
            searchKey="city"
            // onChange={(results) => console.log(results)}
            form="testing"
            id="input"
          />
          <Button type="submit">Submit</Button>
        </Form> */}
        <h2>Checkbox</h2>
        {/* <Form name="checkTest" form={{check: true}}>
          <Inputs.Check
            label="Form Managed" 
            form="checkTest"
            id="check"
          />
        </Form> */}
        <h2>Select</h2>
        {/* <Inputs.Select 
          form="select-f"
          id="select"
          options={[
            {value: 'f', label: 'first'},
            {value: 's', label: 'second'},
            {value: 't', label: 'third'},
          ]}
        /> */}
        <Form name="select-test" form={{select: 'f'}}>
          <Inputs.Select 
            form="select-test" 
            id="select"
          >
            <option value='f'>a</option>
            <option value='d'>d</option>
            <option value='c'>c</option>
          </Inputs.Select>
        </Form>

        <h2>Radio</h2>
        <Form name="test" form={{input: '1'}}>
          <Inputs.Radio form="test" id="input">
            <Inputs.RadioButton label="1" value="1" />        
            <Inputs.RadioButton label="2" value="2" />        
            <Inputs.RadioButton label="3" value="3" />
          </Inputs.Radio>
        </Form>
        {/* <Form name="testing" form={{input: false}}>
          <Inputs.Radio label="Self Managed" />        
        </Form> */}
      </div>
    )
  }
}
