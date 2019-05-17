import React from 'react'
import Utils from '~/utils'

// import { Json } from '~/components'
import AutocompleteResults from './Results'

export default class ApiContainer extends React.Component {
  constructor(props) {
    super(props)

    this.utils = new Utils()

    this.state = {
      results: [],
      offset: 0,
    }
  }

  componentDidMount() {
    this.setState({results: [], offset: 0})
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchText && prevProps.searchText != this.props.searchText) {
      let args = [
        this.props.api,
        this.props.searchText,
        this.props.limit,
        this.state.offset,
      ]
      //Ensure API call only made when min search is met...
      if (this.props.searchText.length >= this.props.minSearch)
        this.callApi(...args)
    }
  }

  callApi(api, searchText, limit) {
    let request = {
      path: api,
      data: {
        text: searchText,
        limit: limit,
        offset: 0
      }
    }

    this.utils.request(request).then((data) => {
      let output = {
        searchText: searchText,
        toggled: true,
        exact: data.exact,
        selected: false,
        results: data.results
      }

      this.setState({results: data.results}, () => {
        this.props.onChange(output)
      })
    })
  }

  render() {
    let { toggled, width  } = this.props
    let results = this.state.results

    if (!toggled) {
      results = []
    }

    return (
      <AutocompleteResults
        width={width}
        results={results}
        className="tt-menu tt-open"
        onSelect={this.props.onChange}
        resultsComponent={this.props.resultsComponent}
        searchKey={this.props.searchKey}
      />
    )
  }
}
