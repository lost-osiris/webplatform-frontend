import React from 'react'

import AutocompleteResults from './Results'

export default class AutocompleteContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      results: [],
      value: '',
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { data, searchText, toggled, rawData, searchKey } = this.props

    // If a search key is not provided, set it to a blank string
    if (!searchKey) {
      searchKey = ''
    }

    if (toggled) {
      let { results, exact, exactValue } = this.findResults(searchText, data, rawData, searchKey)

      if ((results.length !== this.state.results.length || this.state.value !== searchText)) {
        let output = {
          searchText: searchText,
          toggled: true,
          exact: exact,
          selected: false,
          results: results
        }

        if (exact) {
          output.selectedValue = exactValue
        }

        this.setState({results: results, value: searchText}, () => this.props.onChange(output))
      }
    }
    else {
      if (prevState.results != this.state.results) {
        let results = []
        this.setState({results: results})
      } else if (this.state.value !== searchText) {
        this.setState({value: searchText})
      }
    }
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

  findResults(searchText, data, rawData, searchKey) {
    searchText = String(searchText).toLowerCase()

    let output = []

    let exact = false
    let exactValue = undefined

    // Loop through all elements within the data
    for (let i in data) {
      let item = String(data[i]).toLowerCase()
      let index = item.indexOf(searchText)

      // If the searchText is a substring of the current item being iterated over
      if (index > -1) {
        let indexes = []
        let result = {
          searchText: searchText,
          value: item,
          rawData: this.getValue(searchKey, rawData[i])
        }

        // Loop through the characters of the search text and
        // compare them to the item's characters
        for (let c in searchText) {
          let char = searchText[c]
          for (let j in item) {
            let charCompare = item[j]
            let charIndex = parseInt(j)


            if (charCompare === char && indexes.indexOf(charIndex) === -1) {
              indexes.push(charIndex)
            }
          }
        }

        if (result.value.toLowerCase() === searchText.toLowerCase()) {
          exact = true
          exactValue = this.getValue(searchKey, rawData[i])
        }

        result.indexes = indexes.sort((a, b) => a - b)

        output.push(result)
      }
    }

    return {results: output, exact, exactValue}
  }

  render() {
    let { width, searchKey } = this.props

    if (this.props.toggled) {
      return (
        <AutocompleteResults
          width={width}
          results={this.state.results}
          className="tt-menu tt-open"
          onSelect={this.props.handleEvent}
          resultsComponent={this.props.resultsComponent}
          searchKey={searchKey}
          onSuggestionSelect={this.props.onSuggestionSelect}
        />
      )
    }
    else {
      return (<div />)
    }
  }
}
