import React, { Component } from 'react'
import _ from 'lodash'
import { FormatDate, Pagination } from 'webplatform-ui'

export default class SearchResults extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hover: false,
    }
  }

  renderTable(data) {
    if (!data || data.length === 0) {
      return (
        <tr>
          <td width="45%" />
          <td width="15%" />
          <td width="15%" />
          <td width="15%" />
        </tr>
      )
    }

    return Pagination.getItemsOnPage(
      data,
      this.props.entries,
      this.props.page
    ).map(item => {
      const failed = _.has(item, 'failure')
      const rowClassName = failed ? 'text-danger f-700' : ''
      return (
        <tr
          key={`${item._id}-row`}
          onClick={() => this.props.onClick(item._id)}
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
          className={rowClassName}
          style={this.state.hover ? {cursor: 'pointer'} : {}}
        >
          <td width="45%">
            <FormatDate date={ item.timestamp } />
          </td>
          <td width="15%">
            {item.path}
          </td>
          <td width="15%">
            {item.uid}
          </td>
          <td width="15%">
            {item.action}
          </td>
        </tr>
      )
    })
  }

  render() {
    const { loading } = this.props
    const data = this.props.data || []

    return !loading && data.length >= 0
      ? (
        <div>
          <div className="card">
            <div className="card-header ch-alt">
              <h3>{`Search Results (${data.length})`}</h3>
              <p>{`Page ${this.props.page} of ${this.props.pageCount}`}</p>
            </div>
            <div className="card-body card-padding">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Module</th>
                    <th>UID</th>
                    <th>Action Type</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderTable(data)}
                </tbody>
              </table>
              {this.props.pagination}
            </div>
          </div>
        </div>
      ) : <div />
  }
}
