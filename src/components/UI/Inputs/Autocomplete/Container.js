import React, { Component } from 'react'
// import { Inputs } from '~/components'

import ResultsContainer from './ResultsContainer'

export default class Autocomplete extends Component {
  constructor(props) {
    super(props)

    this.state = {
      resultsWidth: null,
      normalizedData: false,
      rawData: props.data,
      exact: false,
      minSearch: props.minSearch || 2,
      limit: props.limit || 15
    }
  }

  componentDidMount() {
    let state = {
      normalizedData: this.normalize(this.props.searchKey, this.props.data),
      rawData: this.props.data,
      exact: false,
      minSearch: this.props.minSearch || 2,
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

  render() {

    this.input = React.createRef()

    let containerProps = {
      data: this.state.normalizedData,
      rawData: this.state.rawData,
      toggled: this.props.toggled,
      searchText: this.props.value,
      handleEvent: this.props.onChange,
      width: this.state.resultsWidth,
      searchKey: this.props.searchKey,
      limit: this.state.limit,
      resultsComponent: this.props.resultsComponent,
      onChange: this.props.onChange,
      onSuggestionSelect: this.props.onSuggestionSelect
    }

    return <ResultsContainer {...containerProps} />
  }
}
