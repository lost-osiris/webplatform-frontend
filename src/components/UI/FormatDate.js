import React, { Component } from 'react'
import moment from 'moment-timezone'

import Utils from '~/utils'

export default class FormatDate extends Component {
  constructor(props) {
    super(props)
    this.date = new Date(props.date)
    this.format = 'MMMM Do YYYY'
    // this.format = 'MM/DD/YYYY'

    this.tzFormat = ' Z z'

    if (props.hour != false) {
      this.format += ' [at] h:mm a'
      // this.format += ' h:mm a'
    } else {
      this.tzFormat = false
    }

    if (props.offset == false) {
      this.tzFormat = ' z'
    }

    if (props.timezone == false) {
      this.tzFormat = false
    }

    if (this.tzFormat) {
      this.format += this.tzFormat
    }

    this.utils = new Utils()

    this.final = 'N/A'
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setup(nextProps.date)
  }

  UNSAFE_componentWillMount() {
    this.setup(this.props.date)
  }

  setup(date) {
    if (date === undefined || date === 'N/A') {
      this.final = 'N/A'
    } else {
      let timezone = this.utils.getUserTimezone()

      if (date !== undefined) {
        // 07/22/2017 04:00 AM
        const re = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}) (\w{2})/

        if (re.test(date)) {
          this.date = moment.utc(date, 'MM/DD/YYYY hh:mm a')
        } else {
          this.date = moment.utc(date)
        }

        if (this.tzFormat) {
          this.final = this.date.tz(timezone).format(this.format)
        } else {
          this.final = this.date.format(this.format)
        }
      }
    }
  }

  render() {
    return (
      <span>{ this.final }</span>
    )
  }
}
