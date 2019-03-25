import React, { Component } from 'react'
import classnames from 'classnames'
import _ from 'lodash'
import { Inputs } from '~/components'

class AutocompleteResults extends Component {
  constructor(props) {
    super(props)
    this.style = {
      width: '0px',
      maxHeight: '200px',
      overflowY: 'auto'
    }

    if (props.width != null) {
      this.style.width = props.width + 'px'
    }
  }

  // UNSAFE_componentWillUpdate(nextProps) {
  //   if (nextProps.width != null) {
  //     this.width = nextProps.width
  //   }
  // }

  render() {
    let style = {...this.style}
    style.width = this.width

    return (
      <div className={ this.props.className } style={ {position: 'fixed', 'zIndex': 100, width: style.width } }>
        <div className="tt-dataset tt-dataset-states" style={ style }>
          { this.props.results }
        </div>
      </div>
    )
  }
}

export class Autocomplete extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toggled: false,
      resultsWidth: null,
      results: [],
      normalizedData: false,
    }
    this.rawData = props.data
    this.searchKey = props.searchKey
    this.onSelection = props.onSelection
    this.onChange = props.onChange
    this.searchText = props.searchText
    this.exact = false
    this.searchResult = null
    this.searchIndex = null
    this.searchResultsList = []
    this.minSearch = props.minSearch
    this.defaultMinSearch = 2
    if (props.minSearch != undefined) {
      this.minSearch = props.minSearch
    } else {
      this.minSearch = this.defaultMinSearch
    }
    this.placeholder = 'Enter Text Here'
    if (props.placeholder != undefined) {
      this.placeholder = props.placeholder
    }
    this.isObject = props.isObject
    this.classes = classnames({
      'show': false,
      'hide': true,
      'tt-menu': true,
      'tt-open': true,
    })

    this.error = false
    if (props.error != undefined) {
      this.error = props.error
    }

    this.className = classnames({
      'fg-line': true,
      'has-error': this.error
    })

  }

  componentDidMount() {
    if (this.state.resultsWidth == null) {
      this.setState({resultsWidth: this.input.offsetWidth})
    }

    this.normalize(this.rawData).then((normalizedData) => {
      let exact = this.checkMatch(this.props)
      this.setState({normalizedData: normalizedData, exact: exact})
    })
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (nextProps.data != this.rawData) {
  //     this.rawData = nextProps.data
  //     this.normalize(this.rawData).then((normalizedData) => {
  //       this.setState({normalizedData: normalizedData})
  //     })
  //   }
  //
  //   this.searchKey = nextProps.searchKey
  //   this.placeholder = nextProps.placeholder
  //
  //   // added this to be able to reset input
  //   this.searchText = nextProps.searchText
  //   this.error = false
  //   if (nextProps.error != undefined) {
  //     this.error = nextProps.error
  //   }
  //
  //   this.className = classnames({
  //     'fg-line': true,
  //     'has-error': this.error,
  //     'fg-toggled': this.state.toggled,
  //     'twitter-typeahead': true,
  //   })
  //
  // }

  // compnentDidReciveProps() {
  shouldCompnentUpdate() {
    console.log('autocomplete should update!!')
    if (this.rawData != this.props.data) {
      this.rawData = this.props.data
      this.normalize(this.rawData).then((normalizedData) => {
        this.setState({normalizedData: normalizedData})
      })
    }

    this.searchKey = this.props.searchKey
    this.placeholder = this.props.placeholder

    //functionality for reseting Input
    this.searchText = this.props.searchText
    this.error = false
    if (this.props.error != undefined) {
      this.error = this.props.error
    }

    this.className = classnames({
      'fg-line': true,
      'has-error': this.error,
      'fg-toggled': this.state.toggled,
      'twitter-typeahead': true,
    })
  }

  async normalize(data) {
    let output = {
      keys: [],
      data: {}
    }

    if (data == undefined) {
      return output
    }

    if (this.isObject) {
      for (let i in data) {
        output.keys.push(i)
        output.data[i] = [i]
      }

      return output
    }

    let seen = {}

    for (let i = 0; i < data.length; i++) {
      let value = data[i]

      if (this.searchKey != undefined) {
        value = value[this.searchKey]
      }

      if (!seen[value]) {
        seen[value] = true
        output.keys.push(value)
      }

      if (output.data[value] == undefined) {
        output.data[value] = [i]
      } else {
        output.data[value].push(i)
      }
    }

    return output
  }

  // allow parent to query if search text
  // is an exact match
  isExact() {
    return this.state.exact
  }

  checkMatch(props) {
    const { searchText } = props
    if (searchText !== undefined && searchText !== '' && searchText !== null) {
      return true
    }

    return false
  }

  handleChange(text) {
    this.renderResults()
    // this.searchText = event.target.value
    // this.setState({searchText: event.target.value})
    this.searchText = text
    this.setState({searchText: text})
  }

  handleEvent(toggle) {
    this.className = classnames({
      'fg-line': true,
      'fg-toggled': toggle,
      'twitter-typeahead': true,
    })
    this.setState({toggled: toggle})
  }

  handleOnSelection(value) {
    this.searchText = value
    this.renderResults()
    this.handleEvent(false)
  }

  async getResults() {
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

  async renderResults() {
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

  render() {
    const handleFocus = () => {
      this.classes = classnames({
        'show': true,
        'hide': false,
        'tt-menu': true,
        'tt-open': true,
      })
      this.handleEvent(true)
    }

    const handleBlur = () => {
      this.classes = classnames({
        'show': false,
        'hide': true,
        'tt-menu': true,
        'tt-open': true,
      })
      this.handleEvent(false)
    }

    const handleChange = (text) => {
      console.log('handling event, target is:', text)
      this.handleChange(text)
    }

    this.input = React.createRef()

    return (
      <div className={ this.className }>
        {/* <input */}
        <Inputs.Text
          ref={ this.input }
          type="text"
          value={ this.searchText || '' }
          onFocus={ handleFocus }
          onChange={ handleChange }
          onBlur={ handleBlur }
          className="form-control typeahead"
          placeholder={ this.placeholder } />
        <AutocompleteResults
          width={this.state.resultsWidth}
          results={this.state.resultsComponent}
          className={this.classes} />
      </div>
    )
  }
}
