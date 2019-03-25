import React, { Component } from 'react'
// import classnames from 'classnames'
// import _ from 'lodash'
import { Inputs } from '~/components'

import AutocompleteContainer from './Container'

export default class Autocomplete extends Component {
  constructor(props) {
    super(props)

    this.state = {
      toggled: false,
      resultsWidth: null,
      normalizedData: false,
      rawData: props.data,
      exact: false,
      value: props.value || '',
      minSearch: props.minSearch || 2,
      placeholder: props.placeholder || 'Search for value...',
      limit: props.limit || 15
    }
  }

  componentDidMount() {
    let state = {
      toggled: false,
      normalizedData: this.normalize(this.props.searchKey, this.props.data),
      rawData: this.props.data,
      exact: false,
      value: this.props.value || '',
      minSearch: this.props.minSearch || 2,
      placeholder: this.props.placeholder || 'Search for value...',
      resultsWidth: this.input.offsetWidth,
      limit: this.props.limit || 15
    }

    this.setState(state)
  }

  getValue(key, data) {
    let keys = key.split('.')

    let output = data
    for (let i in keys) {
      let k = keys[i]
      output = data[k]

      data = output
    }

    return output
  }

  normalize(key, data) {
    let output = []

    if (!data) {
      return []
    }

    if (!(data instanceof Array)) {
      for (let k in data) {
        output.push(data[k])
      }

      return output
    }

    for (let i in data) {
      let item = data[i]

      if (key) {
        output.push(this.getValue(key, item))
      } else {
        output.push(item)
      }
    }

    return output
  }

  handleEvent({toggled, text}) {
    let update = {}

    if (text && text.length >= this.state.minSearch) {
      update['value'] = text

      if (toggled !== undefined || toggled !== null) {
        update['toggled'] = toggled
      }
    } else if (text && text.length < this.state.minSearch) {
      update['value'] = text
      update['toggled'] = false
    } else if (text === '') {
      update['value'] = text
      update['toggled'] = false
    }

    if (!text && toggled === false) {
      update['toggled'] = toggled
    }

    this.setState(update)
  }

  render() {
    const handleFocus = () => {
      this.handleEvent({toggled: true})
    }

    const handleBlur = () => {
      this.handleEvent({toggled: false})
    }

    const handleChange = (text) => {
      this.handleEvent({text: text, toggled: true})
    }

    this.input = React.createRef()

    let containerProps = {
      data: this.state.normalizedData,
      rawData: this.state.rawData,
      toggled: this.state.toggled,
      searchText: this.state.value,
      handleEvent: (props) => this.handleEvent(props),
      width: this.state.resultsWidth,
      searchKey: this.props.searchKey,
      limit: this.state.limit,
      resultsComponent: this.props.resultsComponent
    }

    let Container = <AutocompleteContainer {...containerProps} />

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
          placeholder={ this.placeholder }
          style={{marginBottom: 0}}
          error={this.props.error}
        />
        { Container }
      </div>
    )
  }
}
