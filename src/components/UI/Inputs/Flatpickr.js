import React, { Component } from 'react'
import Flatpickr from 'flatpickr'

export default class Datetime extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: undefined
    }

    this.HOOKS = [
      'onChange',
      'onOpen',
      'onClose',
      'onMonthChange',
      'onYearChange',
      'onReady',
      'onValueUpdate',
      'onDayCreate'
    ]
  }

  handleChange(date, strDate, instance) {
    if (this.props.onChange) {
      this.props.onChange(strDate)
    }

    this.setState({date: date, instance: instance, strDate: strDate})
  }

  handleClose(date, strDate, instance) {
    if (this.props.onClose) {
      this.props.onClose(strDate)
    }

    this.setState({date: date, instance: instance, strDate: strDate})
  }

  //Default config options for date picker
  getConfig(props) {
    // eslint-disable-next-line no-unused-vars
    let { onChange, onClose, ...rest } = { ...props }

    //Set default day format to m/d/y
    let dateFormat = 'm/d/y'

    //Append time if support for picking time is enabled
    if (this.props.enableTime) {
      dateFormat += ' h:i K'
    }

    return {
      onChange: (date, strDate, instance) => this.handleChange(date, strDate, instance),
      onClose: (date, strDate, instance) => this.handleClose(date, strDate, instance),
      dateFormat: dateFormat,
      ...rest
    }
  }

  componentDidMount() {
    this.flatpickr = new Flatpickr(this.node, this.getConfig(this.props))
    this.forceUpdate()
  }

  componentDidUpdate(prevProps) {
    if (this.flatpickr != undefined) {
      let updates = []

      /*
        New props are looked through and updated as need be. If a prop is found
        to be a "Hook" (as defined above), its value will not be updated. Additions
        or subtractions of props, as well as changes in prop values may cause sideffects
        when such props are responsible for modifying the "input" component of the
        Flatpickr.
      */

      for (const [key, value] of Object.entries(this.props)) {
        if (prevProps[key] !== value && this.HOOKS.indexOf(key) === -1) {
          updates.push(key)
          this.flatpickr.set(key, value)
        }
      }

      if (!updates) {
        for (const [key, value] of Object.entries(prevProps)) {
          if (this.props[key] !== value && this.HOOKS.indexOf(key) === -1) {
            updates.push(key)
            this.flatpickr.set(key, value)
          }
        }
      }

      if (updates.length > 0) {
        let value = this.flatpickr.input.value

        if (value) {
          this.flatpickr.setDate(value, true)
        }
      }
    }
  }

  componentUnmount() {
    this.flatpickr.destroy()
  }

  render() {
    let placeholderText = this.props.placeholder || 'Select a Date...'

    return (
      <input
        className="form-control"
        ref={e => this.node = e}
        placeholder={placeholderText}
      />
    )
  }
}
