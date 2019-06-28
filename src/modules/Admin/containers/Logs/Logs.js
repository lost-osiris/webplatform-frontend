import React, { Component } from 'react'
import Utils from '~/utils'
// import Main from '../components/Main'
import Main from '../../components/Views/Logs/Log'

class MainContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('logs')
  }

  render() {
    return <Main data={this.props.log} />
  }
}

export default MainContainer
