import React, { Component } from 'react'
import Utils from '~/utils'
import { Button, Inputs } from '~/components'
// import Datetime from 'react-datetime'

export default class LogsComponent extends Component {
  constructor(props) {
    super(props)

    this.utils = new Utils('logs')
    let searchProp = this.props.search

    this.state= {
      searchModule: searchProp.Module || '',
      searchUid: searchProp.uid || '',
      searchLimit: searchProp.limit || '',
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.search != prevProps.search) {
      let searchProp = this.props.search
      this.setState({
        searchModule: searchProp.Module,
        searchUid: searchProp.uid,
        searchLimit: searchProp.limit,
      })
    }
  }

  // loading(isLoading) {
  //   this.setState({loading: isLoading})
  // }

  render() {

    var modulesDict = this.utils.getSystemInfo().modules

    var vals = Object.keys(modulesDict).map(function(key){
      return modulesDict[key]
    })

    return (
      <div className="card">
        <div className="card-header ch-alt">
          <h3>Search Logs</h3>
        </div>
        <div className="card-body card-padding">
          <div className="row">
            <div className="col-lg-1 text-right">
              <h4> From </h4>
            </div>
            <div className="col-lg-3">
              <Inputs.DateTime value={ this.props.search.start } enableTime={true} onChange={ (event) => this.props.handleInputChange(event, 'start') } />
            </div>
            <div className="col-lg-1 text-right">
              <h4> To </h4>
            </div>
            <div className="col-lg-3">
              <Inputs.DateTime value={ this.props.search.end } enableTime={true} onChange={ (event) => this.props.handleInputChange(event, 'end') } />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-1 text-right">
              <h4> Modules </h4>
            </div>
            <div className="col-lg-3">
              {/* <Inputs.Text value = { this.props.search.module } placeholder="Partial or full module path" type="text" onChange={ (event) => this.props.handleInputChange(event, 'module') } /> */}
              {/* <Inputs.Text value = { this.state.searchModule } placeholder="Partial or full module path" type="text" onChange={ (event) => this.props.handleInputChange(event, 'module') } /> */}
              <Inputs.Autocomplete
                placeholder="Partial of full module path"
                searchText={this.props.search.module}
                minSearch={3}
                data={vals}
                searchKey="module"
                onChange={(event) => this.props.handleInputChange(event, 'module')}
              />
            </div>
            <div className="col-lg-1 text-right">
              <h4> UID </h4>
            </div>
            <div className="col-lg-5">
              {/* <Inputs.Text value={ this.props.search.uid } placeholder="Kerberos ID" type="text" onChange={ (event) => this.props.handleInputChange(event, 'uid') } /> */}
              {/* <Inputs.Text value={ this.state.searchUid } placeholder="Kerberos ID" type="text" onChange={ (event) => this.props.handleInputChange(event, 'uid') } /> */}
              <Inputs.Autocomplete
                type="user"
                placeholder="Kerberos ID"
                searchText={this.props.search.uid}
                minSearch={3}
                onChange={(event) => this.props.handleInputChange(event, 'uid')}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-1 text-right">
              <h4>Failures Only</h4>
            </div>
            <div className="col-lg-3">
              <label style={{ marginTop: '10px' }}>
                <Inputs.Check
                  // checked={this.props.search.failuresOnly || false}
                  checked={this.props.search.failuresOnly}
                  inline
                  onChange={(e) => this.props.handleInputChange(e, 'failuresOnly')}
                />
              </label>
            </div>
            <div className="col-lg-1 text-right">
              <h4>Limit</h4>
            </div>
            <div className="col-lg-1">
              <Inputs.Text value={ this.props.search.limit } type="number" onChange={ (event) => this.props.handleInputChange(event, 'limit') } />
              {/* <Inputs.Text value={ this.state.searchLimit } type="number" onChange={ (event) => this.props.handleInputChange(event, 'limit') } /> */}
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-1 text-right">
              <Button
                btnStyle="primary"
                onClick={() => this.props.submitSearch()}
              >
                <b>Search</b>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
