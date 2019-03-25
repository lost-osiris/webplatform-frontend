import React from 'react'
import _ from 'lodash'

const getResults = async () => {
  var results = []

  this.searchResult = null
  this.searchIndex = null
  this.exact = false

  if (this.searchText.length >= this.minSearch) {
    let idx = 0
    this.state.normalizedData.keys.forEach(key => {
      let indexes = []
      let value = key
      let newValue = String(value)

      let index = String(newValue).toLowerCase().indexOf(this.searchText.toLowerCase())
      if (index > -1) {
        this.searchResultsList.push(value)
        for (let i = 0; i < newValue.length; i++) {
          for (let j = 0; j < this.searchText.length; j++) {
            let search = String(this.searchText[j]).toLowerCase()
            if (String(newValue[i]).toLowerCase() == search && !indexes.includes(i)) {
              indexes.push(i)
            }
          }
        }
      }

      if (indexes.length > 0) {
        let output = {
          searchText: this.searchText,
          value: newValue,
          indexes: indexes,
        }

        let checkIndex = _.findIndex(results, (o) => {return o.value == output.value})
        if (checkIndex == -1) {
          results.push(output)
        }

        if (this.searchText.toLowerCase() == newValue.toLowerCase()) {
          this.searchText = newValue
          this.searchResult = value
          this.searchIndex = idx
          this.exact = true
        }
      }
      idx++
    })
  }

  return await results
}

const renderResults = async () => {
  let promise = this.getResults()

  let callback = async (results) => {
    let index = 0
    let resultsComponent = []
    if (!this.state.exact) {
      resultsComponent = results.map((r) => {
        let result = []
        let count = 0
        for (let i in r.value) {
          if (r.indexes[count] == i) {
            let key = r.value[i] + '-' + index + '-' + r.indexes[count]
            result.push(
              <strong key={ key } className="tt-highlight">{r.value[i]}</strong>
            )
            count++
          } else {
            result.push(r.value[i])
          }
        }

        let key = 'suggestion-' + index
        index++

        var onSelection
        if (this.onSelection == undefined) {
          onSelection = () => {
            this.handleOnSelection(r.value)
          }

        } else {
          onSelection = () => {
            this.onSelection(r)
          }
        }

        return (
          <div key={ key } className="tt-suggestion tt-selectable" onMouseDown={ onSelection }>
            { result }
          </div>
        )
      })
    }

    this.setState({resultsComponent: resultsComponent})

    const handleChange = async () => {
      let output = []
      let match
      for (let i in results) {
        let value = results[i].value

        let indexes = this.state.normalizedData.data[value]

        // Adds the items corresponding to the matching indexes
        indexes.forEach(index => output.push(this.rawData[index]))
      }

      if (this.exact) {
        // the object that was matched
        match = this.rawData[this.searchIndex]
      }

      return await {
        searchText: this.searchText,
        result: this.searchResult,
        index: this.searchIndex,
        exact: this.state.exact,
        resultsList: output,
        searchKey: this.searchKey,
        match,
      }
    }

    return handleChange()
  }

  promise.then(callback).then((data) => {
    if (this.onChange != undefined) {
      this.onChange(data)
    }
  })
}

export { renderResults, getResults }
