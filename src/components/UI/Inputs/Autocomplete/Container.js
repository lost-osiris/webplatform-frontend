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

  componentDidUpdate() {
    // Checking data change based on another input changing the incoming data on props
    if (this.state.rawData.length !== this.props.data.length) {
      this.updateRawData(this.props.data, this.props.searchKey)
    } else if (this.props.disabled === false) {
      // When data change takes place but new/old have same lengths
      // Further comparison needs to take place to detect change
      let isChanged = false

      for (let i in this.state.rawData) {
        let value = this.state.rawData[i]
        let found = false
  
        for (let j in this.props.data) {
          let compare = this.props.data[j]
          if (this.props.searchKey) {
            if (value[this.props.searchKey] === compare[this.props.searchKey]) {
              found = true 
            }
          } else {
            if (value === compare) {
              found = true
            }
          }
        }
  
        if (!found) {
          isChanged = true
          break
        }
      }
  
      if (isChanged) {
        this.updateRawData(this.props.data, this.props.searchKey)
      }
    }
  }

  updateRawData(newData, searchKey) {
    let newState = {
      normalizedData: this.normalize(searchKey, newData),
      rawData: newData
    }
    this.setState(newState)
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
