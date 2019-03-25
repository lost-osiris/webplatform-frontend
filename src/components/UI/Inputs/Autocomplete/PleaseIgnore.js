import React, { Component } from 'react'
import classnames from 'classnames'
import Utils from '~/utils'

class AutocompleteResults extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollTop: 0,
    }

    this.style = {
      width: '0px',
      maxHeight: '200px',
      overflowY: 'auto'
    }

    if (props.width != null) {
      this.style.width = props.width + 'px'
    }

    this.resultsOffset = 0
    this.OFFSET = 15
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (nextProps.width != null) {
      this.width = nextProps.width
    }
  }

  render() {
    let style = {...this.style}
    style.width = this.width

    let onScroll = (element) => {
      let e = element.target

      let currentScroll = e.scrollTop + e.clientHeight
      this.setState({scrollTop: currentScroll})

      if (currentScroll >= e.scrollHeight - 100) {
        this.resultsOffset += this.OFFSET

        if (this.state.scrollTop < currentScroll || this.state.scrollTop != currentScroll) {
          this.props.callApi(this.resultsOffset)
        }
      }
    }

    return (
      <div className={ this.props.className } style={ {position: 'fixed', 'zIndex': 100, width: style.width } }>
        <div onScroll={(e) => onScroll(e)} className="tt-dataset tt-dataset-states" style={ style }>
          { this.props.results }
        </div>
      </div>
    )
  }
}

export default class ApiAutocomplete extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()
    this.state = {
      toggled: false,
      resultsWidth: null,
      resultsHeight: null,
      results: [],
      normalizedData: false,
      finished: false,
    }

    this.options = {
      minSearch: props.minSearch,
      placeholder: props.placeholder,
    }

    if (this.options.minSearch == undefined) {
      this.options.minSearch = 2
    }

    if (this.options.placeholder == undefined) {
      this.options.placeholder = 'Enter Text Here'
    }

    this.api = props.api
    this.onSelection = props.onSelection
    this.onChange = props.onChange
    this.searchText = props.searchText
    this.resultKey = props.resultKey

    this.exact = false
    this.searchResult = null
    this.searchIndex = null
    this.searchResultsList = []
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
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.searchText = nextProps.searchText
    this.error = false
    if (nextProps.error != undefined) {
      this.error = nextProps.error
    }

    this.className = classnames({
      'fg-line': true,
      'has-error': this.error,
      'fg-toggled': this.state.toggled,
      'twitter-typeahead': true,
    })

  }

  // allow parent to query if search text
  // is an exact match
  isExact() {
    return this.exact
  }

  initializeMatch() {
    const { searchText } = this.props
    if (searchText !== undefined && searchText !== '' && searchText !== null) {
      this.exact = true
    }
  }

  handleChange(event) {
    this.searchText = event.target.value
    this.setState({searchText: event.target.value})
    if (this.searchText.length >= this.options.minSearch) {
      this.renderResults(this.searchText)
    }
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
    this.handleEvent(false)
    this.searchText = value
    this.setState({searchText: value})
  }

  callApi(offset) {
    let promise = this.getResults(this.state.searchText, offset)
    promise.then((results) => {
      let newResults = this.state.results.concat(results)
      this.resultsComponent(newResults).then((data) =>{
        if (this.onChange != undefined) {
          this.onChange(data)
        }
      })

      this.setState({results: newResults})
    })
  }

  async getResults(searchText, offset) {
    if (offset == undefined) {
      offset = 0
    }

    let api = {
      path: this.api,
      data: {
        text: searchText,
        options: this.options,
        offset: offset,
        limit: 15
      }
    }

    return this.utils.request(api)
  }

  async resultsComponent(results) {
    let index = 0
    let resultsComponent = results.map((r) => {
      let key = 'suggestion-' + index
      index++

      var onSelection = (result) => {
        this.handleOnSelection(result.uid)
        let data = {
          searchText: this.searchText,
          result: results,
          exact: this.exact,
          selected: true,
          match: result
        }

        if (this.onChange != undefined) {
          this.onChange(data)
        }
      }

      return (
        <div key={ key } className="tt-suggestion tt-selectable" onMouseDown={() => onSelection(r) }>
          <this.props.resultsComponent {...r} />
        </div>
      )
    })

    this.setState({resultsComponent: resultsComponent, results: results})

    const handleChange = async (results) => {
      if (results.length > 0) {
        this.setState({finished: false})
      } else {
        this.setState({finished: true})
      }

      return await {
        searchText: this.searchText,
        result: results,
        exact: this.exact,
        selected: false
      }
    }

    return handleChange(results)
  }

  async renderResults(text) {
    let promise = this.getResults(text)

    promise.then((results) => this.resultsComponent(results)).then((data) => {
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

    const handleChange = (event) => {
      this.handleChange(event)
    }

    return (
      <div className={ this.className }>
        <input
          ref={ this.input }
          type="text"
          value={ this.state.searchText || '' }
          onFocus={ handleFocus }
          onChange={ handleChange }
          onBlur={ handleBlur }
          className="form-control typeahead"
          placeholder={ this.placeholder } />
        <AutocompleteResults
          callApi={(offset) => this.callApi(offset)}
          width={this.state.resultsWidth}
          results={this.state.resultsComponent}
          className={this.classes} />
      </div>
    )
  }
}
