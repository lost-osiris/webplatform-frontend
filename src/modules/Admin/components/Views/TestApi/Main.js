import React, { Component } from 'react'
import Utils from '~/utils'

import { Json, Loading, Button, Inputs } from '~/components'

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
  }

  UNSAFE_componentWillMount() {
    this.apis = this.utils.getSystemInfo().modules

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

  newData(event) {
    this.data = event.target.value
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
    if (this.state.data == null) {
      return <Loading />
    }

    return (
      <div>
        <div className="row">
          <div className="col-lg-2">
            <h3>API</h3>
          </div>
          <div className="col-lg-4">
            <Inputs.Autocomplete
              placeholder="API module..."
              minSearch={1}
              data={this.apis}
              onChange={(result) => this.newApi(result)}
              searchText={this.path}
              isObject={true}
              data-labe="api"
            />
          </div>
          <div className="col-lg-4">
            <Button onClick={()=> this.refresh()}>Refresh</Button>
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
            {!this.state.error
              ?
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
