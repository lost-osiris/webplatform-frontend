import React from 'react'

import AutocompleteResults from './Results'

export default class AutocompleteContainer extends React.Component {
  constructor(props) {
    super(props)
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
    let indexes = []

    for (let c in searchText) {
      let char = searchText[c]

      let result = {
        indexes: [],
        searchText: searchText
      }

      for (let i in data) {
        let item = String(data[i]).toLowerCase()

        let index = item.indexOf(searchText)

        // console.log(char, index, indexes)
        if (index > -1 && !indexes.includes(data[i])) {
          for (let j in item) {
            let charCompare = item[j]
            if (charCompare === char) {
              result.indexes.push(parseInt(j))
            }
          }

          result.value = data[i]
          result.rawData = this.getValue(searchKey, rawData[i])

          output.push(result)
          indexes.push(data[i])

        } else if (index > -1) {
          result = output[indexes.indexOf(data[i])]

          for (let j in item) {
            let charCompare = item[j]
            if (charCompare === char) {
              result.indexes.push(parseInt(j))
            }
          }
        }
      }
    }

    return output
  }

  render() {
    let results = []
    let { data, searchText, toggled, width, rawData, searchKey } = this.props

    if (toggled) {
      results = this.findResults(searchText, data, rawData, searchKey)

      if (results.length === 1 && results[0].value === searchText) {
        results = []
      }
    }

    return (
      <AutocompleteResults
        width={width}
        results={results}
        className="tt-menu tt-open"
        onSelect={this.props.handleEvent}
        resultsComponent={this.props.resultsComponent}
        searchKey={this.props.searchKey}
      />
    )
  }
}
