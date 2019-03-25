import React, { Component } from 'react'

import { TestApi } from '~/components/Views'

class TestApiContainer extends Component {
  constructor(props) {
    super(props)
    this.data = {
      application: 'support-exceptions',
      permissions: 'admin'
    }
  }

  render() {
    return (
      <TestApi {...this.props} data={this.data} />
    )
  }
}

export default TestApiContainer
