import React, { Component } from 'react'
import { connect } from 'react-redux'

class ProgressBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      percent: 0,
      show: false,
    }
  }

  componentDidMount() {
    this.index = 0
    this.startSize = 1
    this.latencyThreshold = 200
  }

  componentDidUpdate(nextProps) {
    const { show, percent } = this.state

    this.apis = nextProps.apis
    let loading = this.checkLoading()

    if (loading) {
      if (!show && percent == 0) {
        this.setState({show: true})
        this.start()

      } else if (!show && percent > 0) {
        this.setState({percent: 0, show: true})
      }

    } else {
      if (show && percent < 50) {
        this.stop()
      } else if (show && percent == 50) {
        let completedAnimation = setTimeout(() => {
          this.setState({percent: 0})
          clearTimeout(this.state.completedAnimation)
        }, 200)

        this.setState({completedAnimation: completedAnimation, show: false})
      }
    }
  }

  checkLoading() {
    for (let i in this.apis) {
      let api = this.apis[i]

      if (api == 'system.info' || api == 'users.get') {
        continue
      } else {
        if (api) {
          return true
        }
      }
    }

    return false
  }

  inc() {
    const { percent } = this.state
    const rnd = Math.cos(percent * (Math.PI / 2 / 100))

    if (percent + rnd < 49.99995) {
      return percent + rnd
    }

    return percent
  }

  start() {
    let timer = setInterval(() => {
      const { show } = this.state
      if (show) {
        let percent = this.inc()
        if (percent < 49.99995) {
          this.setState({percent: percent})
        }
      } else {
        clearInterval(this.state.timer)
      }
    }, this.latencyThreshold)

    this.setState({timer: timer})
  }

  stop() {
    this.setState({percent: 50})
  }

  buildStyle() {
    const style = {
      width: `${this.state.percent}%`,
    }

    if (this.state.show) {
      style.transition = 'width 200ms linear'
    }

    return style
  }

  render() {
    return (
      <div className="progress-bar-container">
        <div style={ this.buildStyle() } className="left" />
        <div style={ this.buildStyle() } className="right" />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {apis: state.dashboard.loading}
}

export default connect(mapStateToProps)(ProgressBar)
