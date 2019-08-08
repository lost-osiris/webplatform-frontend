import React, { Component } from 'react'

import { Json, Button, Inputs, Utils } from 'webplatform-ui'

class TestAPI extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      error: false
    }

    this.utils = new Utils()

    if (props.match.params.apiPath != undefined) {
      this.path = props.match.params.apiPath.replace('-', '.')
    } else {
      this.path = 'settings.get'
    }

    if (props.data != undefined) {
      this.data = JSON.stringify(props.data, null, '   ')
    } else {
      this.data = {
        'foo': 'bar'
      }
      this.data = JSON.stringify(this.data, null, '   ')
    }

    //Format api data coming in to be fed into autocomplete
    var dict = this.props.apis
    this.apis = Object.keys(dict).map(function(key){
      return dict[key]
    })

  }

  componentDidMount(){

    this.user = this.utils.getUser()
    let permissions = this.user.permissions.system
    if (permissions.is_admin == undefined || !permissions.is_admin) {
      this.utils.push('/access-denied')
    }

    this.utils.request(this.getApi()).then((data) => {
      this.setState({data: data, error: false})
    }).catch(() => {
      this.setState({error: 'Request Failed...', data: {}})
    })
  }

  getApi() {
    return {
      path: this.path,
      data: JSON.parse(this.data)
    }
  }

  newApi(result) {
    this.path = result.searchText
    this.forceUpdate()
  }

  newData(text) {
    this.data = text
    this.forceUpdate()
  }

  refresh() {
    try {
      let api = this.getApi()

      this.utils.request(api).then((data) => {
        this.setState({data: data, error: false})
      }).catch(() => {
        this.setState({error: 'Request Failed...'})
      })
    } catch (e) {
      this.setState({error: 'Data is not valid JSON...'})
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-lg-2">
            <h3>API</h3>
          </div>
          <div className="col-lg-4">
            <Inputs.Autocomplete
              type="modules"
              placeholder="API module..."
              minSearch={1}
              onChange={(result) => this.newApi(result)}
              searchText={this.path}
            />
          </div>
          <div className="col-lg-4">
            <Button btnStyle="primary" onClick={()=> this.refresh()}>Refresh</Button>
          </div>
        </div>
        <div className="row" style={{marginTop: '25px'}}>
          <div className="col-lg-2">
            <h3>Data</h3>
          </div>
          <div className="col-lg-10">
            <Inputs.Text type="textarea" rows="10" value={this.data} onChange={(e) => this.newData(e)} placeHolder="Enter new data" />
          </div>
        </div>
        <div className="row" style={{marginTop: '25px'}}>
          <div className="col-lg-2">
            <h3>Output</h3>
          </div>
          <div className="col-lg-10">
            {!this.state.error ?
              <Json data={this.state.data} />
              :
              <div className="jumbotron">
                <h3>{ this.state.error }</h3>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default TestAPI
