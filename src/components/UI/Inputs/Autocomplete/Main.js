
import React, { Component } from 'react'
import { Inputs } from '~/components'

import Main from './Container'
import ApiContainer from './ApiContainer'
import Utils from '~/utils'

export default class Autocomplete extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.searchText|| '',
      results: [],
      exact: false,
      selected: false,
      toggled: false,
      minSearch: props.minSearch || 3
    }

    this.utils = new Utils()
  }

  componentDidMount() {
    let state = {
      value: this.props.searchText|| '',
      results: {},
      exact: false,
      selected: false,
      toggled: false,
      minSearch: this.props.minSearch || 3
    }

    this.setState(state)
  }

  handleEvent({toggled, searchText, results, exact, selected, selectedValue}) {
    // console.log('handle event... results', results, 'searchText', searchText)

    let update = {}

    if (searchText && searchText.length >= this.state.minSearch) {
      update['value'] = searchText

      if (toggled !== undefined || toggled !== null) {
        update['toggled'] = toggled
      }
    } else if (searchText && searchText.length < this.state.minSearch) {
      update['value'] = searchText
      update['toggled'] = false
    } else if (searchText === '') {
      update['value'] = searchText
      update['toggled'] = false
    }

    if (!searchText && toggled === false) {
      update['toggled'] = toggled
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
      // console.log('eeeee', searchText, this.state.value)
      // console.log(searchText !== '')
      // console.log(this.state.value !== searchText)
      // console.log(searchText.length <= this.state.minSearch)
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

    // console.log('calling', results)
    if (callOnChange) {
      // console.log('ch-ch-ch-ch-changing', results)
      this.props.onChange({
        searchText: searchText || '',
        toggled: update['toggled'] || false,
        exact: exact || false,
        selected: selected || false,
        results: results || [],
        minSearch: this.state.minSearch,
        selectedValue: selectedValue,
      })
    }

    // console.log('updating state to:', update)
    this.setState(update)
    // console.log('boop')
  }

  render() {
    console.log('AUTOCOMPLETE RENDER', this.props)

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
      toggled: this.state.toggled,
      value: this.state.value,
      minSearch: this.state.minSearch || 3,
      ...this.props,
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

    return (
      <div className="twitter-typeahead fg-toggled">
        <Inputs.Text
          ref={ this.input }
          type="text"
          value={ this.state.value }
          onFocus={ handleFocus }
          onChange={ handleChange }
          onBlur={ handleBlur }
          className="form-control typeahead"
          placeholder={ this.props.placeholder || 'Enter a value...' }
          style={{marginBottom: 0}}
          error={this.props.error}
          disabled={this.props.disabled}
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
