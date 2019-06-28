import React, { Component } from 'react'

import TestApi from '~/modules/Admin/components/Views/TestApi/Main'

class TestApiContainer extends Component {
  constructor(props) {
    super(props)
    this.data = {
      application: 'support-exceptions',
      permissions: 'admin'
    }
  }

  render() {
    console.log('TestAPI Container Props:', this.props)
    return (
      <TestApi {...this.props} data={this.data} />
    )
  }
}

export default TestApiContainer
