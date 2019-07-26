
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Inputs, Form } from '~/components'

import Main from './Container'
import ApiContainer from './ApiContainer'
import Utils from '~/utils'

class Autocomplete extends Component {
  constructor(props) {
    super(props)

    this.state = {
      results: [],
      exact: false,
      selected: false,
      toggled: false,
      minSearch: props.minSearch || 3,
      name: undefined,
      value: ''
    }

    this.utils = new Utils()
  }

  componentDidMount() {
    let selfManaged = !this.props.form && !this.props.id
    
    let action = {
      name: this.props.form,
      id: this.props.id
    }
    
    let update = {
      error: this.props.error,
      name: action.name,
      selfManaged: selfManaged,
      results: {},
      exact: false,
      selected: false,
      toggled: false,
      minSearch: this.props.minSearch || 3
    }

    if (selfManaged) {
      update.name = this.utils.getFormCounter()
    }
    
    this.setState(update)
  }

  handleEvent({toggled, searchText, results, exact, selected, selectedValue}) {
    let update = {}
    
    if (searchText && searchText.length >= this.state.minSearch) {
      update.value = searchText

      if (toggled !== undefined || toggled !== null) {
        update.toggled = toggled
      }
    } else if (searchText && searchText.length < this.state.minSearch) {
      update.value = searchText
      update.toggled = false
    } else if (searchText === '') {
      update.value = searchText
      update.toggled = false
    }

    if (!searchText && toggled === false) {
      update.value = searchText
      update.toggled = toggled
    }

    /*
      Subsequent if statements are used in order to handle events in a different order than they
      come in. Key press updates must be first trickled further down into the autocomplete component
      for suggestions to properly display. Then after the suggestions gets populated back an update
      can be triggered at the parent level. The logic below ensures that proper order.

      Note: Due to the nature of api calls, this can not apply to api autocomplets due to the fact that
      the data from the keypress must be communicated to the api when called.
    */

    let callOnChange = false
    // Check to see if custom autocomplete is being used
    if (this.props.type === 'api' || this.props.type === 'user') {
      if (this.state.value !== searchText) {
        callOnChange = true
      } else if (exact || selected) {
        callOnChange = true
      } else if (this.state.results !== results) {
        callOnChange = true
      }

    } else {
      // Ignore first update (keypress update). Second update will follow from ResultsContainer.js
      if (searchText !== '' && this.state.value !== searchText && searchText.length <= this.state.minSearch) {
        callOnChange = true
      }
      // Handle second update from ResultsContainer.js
      else if ((results && results.length > 0) || exact || selected) {
        callOnChange = true
      }
      // Handle instance when only one result is matched
      // but entered text is not exact (does not match suggestion)
      else if (results && results.length === 1 && this.state.value !== searchText){
        callOnChange = true
      }
      else if (this.state.value !== '' && searchText === '') {
        callOnChange = true
      }
    }
    
    if (callOnChange && this.props.onChange) {
      this.props.onChange({
        toggled: update['toggled'] || false,
        exact: exact || false,
        selected: selected || false,
        results: results || [],
        minSearch: this.state.minSearch,
        selectedValue: selectedValue,
        value: searchText
      })
    }

    if (this.props.form) {
      let formValue = this.props.formData[this.props.form]

      if (this.props.id) {
        formValue = formValue[this.props.id]
      }

      if (formValue !== update.value) {
        let action = {
          name: this.state.name,
          id: this.props.id,
          value: update.value
        }
        this.utils.dispatch('FORM_VALUE_UPDATE', action)
      }
    }

    this.setState(update)
  }

  render() {

    const handleFocus = () => {
      this.handleEvent({searchText: this.state.value, toggled: true})
    }

    const handleBlur = () => {
      this.handleEvent({searchText: this.state.value, toggled: false})
    }

    const handleChange = (data) => {
      this.handleEvent({searchText: data, toggled: true})
    }

    this.input = React.createRef()

    let containerProps = {
      ...this.props,
      toggled: this.state.toggled,
      value: this.state.value,
      minSearch: this.state.minSearch || 3,
    }

    let Container

    //Determine the type of autocomplete to create
    if (this.props.type) {
      //Check to create api autocomplete
      if (this.props.type === 'api') {
        Container = <ApiContainer {...containerProps} onChange={(data) => this.handleEvent(data)} />
      }
      //Check to create user autocomplete
      else if (this.props.type === 'user') {
        containerProps.api = 'users.search'
        containerProps.resultsComponent = UserResults
        Container = <ApiContainer {...containerProps} onChange={(data) => this.handleEvent(data)} />
      }
      //Check to create modules autocomplete
      else if (this.props.type === 'modules') {
        let dict = this.utils.getSystemInfo().modules

        var vals = Object.keys(dict).map(function(key){
          return dict[key]
        })

        containerProps.data = vals
        containerProps.searchKey = 'module'
        Container = <Main {...containerProps} onChange={(data) => this.handleEvent(data)} />
      }
    }
    //If type is not defined, create a "normal" default autocomplete
    else {
      Container = <Main {...containerProps} onChange={(data) => this.handleEvent(data)} />
    }

    // console.log(this.props.id, this.props.form)
    return (
      <div className="twitter-typeahead fg-toggled">
        <Inputs.Text
          ref={ this.input }
          type="text"
          onFocus={ handleFocus }
          onChange={ handleChange }
          onBlur={ handleBlur }
          className="form-control typeahead"
          placeholder={ this.props.placeholder || 'Enter a value...' }
          style={{marginBottom: 0}}
          disabled={this.props.disabled}
          error={this.props.error}
          form={this.props.form}
          id={this.props.id}
        />
        { Container }
      </div>
    )
  }
}

class UserResults extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div onMouseDown={() => this.props.onSelect(this.props.uid)}>
        <img className="pull-left autcomplete-user-img" src={this.props.picture} />
        <span>{ this.props.cn } ({ this.props.uid })</span>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return Utils.inputMapStateToProps(state, ownProps, '')
}
export default connect(mapStateToProps)(Autocomplete)
