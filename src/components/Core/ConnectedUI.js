import React, { Component } from 'react'
import { connect } from 'react-redux'

class ConnectedUI extends Component {
  constructor(props) {
    super(props)

    this.state = {
      path: undefined,
      component: <div />
    }
  }

  componentDidMount() {
    this.setup()
  }

  componentDidUpdate() {
    if (this.state.path != this.props.location.key) {
      this.setup()
    }
  }

  setup() {
    let componentProps = {...this.props}
    delete componentProps.mapStateToProps
    delete componentProps.ui

    let UI = <this.props.ui {...componentProps} />
    if (this.props.mapStateToProps) {
      UI = connect(this.props.mapStateToProps, componentProps)(this.props.ui)
      UI = <UI {...componentProps} />
    }

    this.setState({component: UI, path: this.props.location.key})
  }

  render() {
    return this.state.component
  }

}

export default ConnectedUI
