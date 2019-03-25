import React, { Component } from 'react'
import { connect } from 'react-redux'
import Utils from '~/utils'
import Main from '../components/Main'

class MainContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('logs')
    this.state = {
      log: undefined,
    }
  }

  componentWillMount() {
    this.id = this.props.match.params.id
    const logs = this.utils.getState().results

    let log
    if (!logs) {
      const api = {
        path: 'logging.get',
        data: {
          id: this.id,
        }
      }

      this.utils.request(api)
      this.utils.getData().then(data => {
        this.setState({
          log: data
        })
      })
    } else {
      log = logs.find(log => log._id === this.id)
      this.setState({
        log,
      })
    }
  }

  render() {
    return <Main data={this.state.log} />
  }
}

export default connect(state => ({
  results: state.logs.results,
}))(MainContainer)
