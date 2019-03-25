import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Utils from '~/utils'
import Logs from '../components/LogsComponent'
import SearchResults from '../components/SearchResults'
import { Pagination } from '~/components'

class LogsContainer extends Component {
  constructor(props) {
    super(props)
    this.search = {}
    this.utils = new Utils('logs')
    // number of entries to show per page
    this.entries = 25
  }

  UNSAFE_componentWillMount() {
    this.setup()
  }

  UNSAFE_componentWillUpdate() {
    this.setup()
  }

  componentDidUpdate(prevProps) {
    // if user completes a new search, then reset to the base route
    // to avoid the case where the route is currently on a page number that does
    // not exist with the new search
    if (this.props.data !== prevProps.data) {
      this.utils.push('/admin/logs')
    }
  }

  setup() {
    this.search = this.utils.getState() || {}
  }

  handleInputChange(event, type) {
    if (type === 'start' || type === 'end'){
      this.search[type] = event
    } else if (type === 'limit'){
      this.search[type] = parseInt(event.target.value)
    } else if (type === 'failuresOnly'){
      this.search[type] = event.target.checked
    } else {
      this.search[type] = event.target.value
      // console.log(event.target.value, type)
    }
    this.forceUpdate()
  }

  submitSearch(){
    let search = {...this.search}

    delete search.results

    // save search query
    this.utils.dispatch('SEARCH', { data: search }, 'admin.logs')

    Object.keys({...search}).forEach(key => {
      const value = search[key]

      // delete the key since backend does not expect
      // it to be defined if failure filter is off
      if (key === 'failuresOnly' && value === false) {
        delete search.failuresOnly
      }

      if (value === undefined || value === '') {
        delete search[key]
      }
    })

    // converts time into a new moment object with the proper format
    // gets the value of that 'moment' object in milliseconds and converts that to seconds
    search.start = moment(search.start, 'M/D/YYYY H:mm').valueOf() / 1000
    search.end = moment(search.end, 'M/D/YYYY H:mm').valueOf() / 1000

    var api = {
      path:'logging.search',
      data: search
    }

    this.utils.request(api).then(data => {
      this.utils.dispatch('INIT', { data }, 'admin.logs')
    })
  }

  loading(isLoading) {
    this.setState({loading: isLoading})
  }

  getPage() {
    if (this.props.match.params && this.props.match.params.hasOwnProperty('page')) {
      return parseInt(this.props.match.params.page, 10)
    }

    return 1
  }

  getPageCount() {
    return Pagination.getPageCount(this.props.data.length, this.entries)
  }

  getPrevPage() {
    const prev = this.getPage() - 1
    return (prev >= 1 ? prev : 1)
  }

  getNextPage() {
    const next = this.getPage() + 1
    return (next < this.getPageCount() ? next : this.getPageCount())
  }

  navTo(page) {
    this.utils.push(`/admin/logs/page/${page}`)
  }

  render() {
    return (
      <div>
        <Logs
          handleInputChange={ (event, type) => this.handleInputChange(event, type) }
          submitSearch={ () => this.submitSearch() }
          search={ this.search }
        />
        {this.props.data ? (
          <div>
            <SearchResults
              data={this.props.data}
              onClick={(id) => {
                this.utils.push(`/admin/logs/id/${id}`)
              }}
              entries={this.entries}
              page={this.props.data ? this.getPage() : 0}
              pageCount={this.props.data ? this.getPageCount() : 0}
              pagination={
                <Pagination
                    count={this.getPageCount()}
                    selected={this.getPage()}
                    onPagePrev={() => { this.navTo(this.getPrevPage()) }}
                    onPageNext={() => { this.navTo(this.getNextPage()) }}
                    onPage={(page) => { this.navTo(page) }}
                  />
                }
            />
          </div>
        ) : <div></div>}
      </div>
    )
  }
}

export default connect(state => {
  return {
    data: state.logs.results,
    loading: (state.dashboard.loading ? (state.dashboard.loading['logging.search']) : false),
  }
})(LogsContainer)
