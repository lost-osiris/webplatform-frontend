import React, { Component } from 'react'
import classnames from 'classnames'

export default class Input extends Component {
  constructor(props) {
    super(props)
    let className = classnames({
      'form-group__bar': true,
      'has-error': props.error
    })

    this.state = {
      value: props.value || '',
      className: className,
      error: props.error,
    }
  }

  componentDidMount() {
    let className = classnames({
      'form-group': true,
      'has-error': this.props.error
    })

    this.setState({
      className: className,
      value: this.props.value || '',
      error: this.props.error,
    })
  }

  componentDidUpdate(prevProps) {
    let hasUpdate = false
    let update = {}

    if (this.props.error !== this.state.error) {
      hasUpdate = true

      let className = classnames({
        'form-group': true,
        'has-error': this.state.error
      })

      update['className'] = className
      update['error'] = this.props.error
    }

    if (this.props.value === prevProps.value && this.state.value !== prevProps.value) {
      hasUpdate = true
      update['value'] = this.props.value
    }

    if (hasUpdate) {
      this.setState(update)
    }
  }

  handleEvent() {
    let className = classnames({
      'form-group': true,
      'has-error': this.state.error
    })

    this.setState({className: className})
  }

  handleChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e.target.value)
    }

    this.setState({value: e.target.value})
  }

  render() {

    const handleFocus = () => {
      if (this.props.onFocus) {
        this.props.onFocus()
      }

      this.handleEvent(true)
    }

    const handleBlur = () => {
      if (this.props.onBlur) {
        this.props.onBlur()
      }

      this.handleEvent(false)
    }

    let dom

    let valueProp

    if (this.props.value) {
      valueProp = this.props.value
    }
    else {
      valueProp = this.state.value
    }

    let props = {
      value: valueProp,
      onChange: (e) => this.handleChange(e),
      // onChange: (e) => this.props.onChange(e),
      onFocus: handleFocus,
      onBlur: handleBlur,
      className: classnames({
        'form-control': true,
        'textarea-autosize': this.props.type === 'textarea'
      }),
      type: 'text',
      placeholder: this.props.placeholder,
    }

    if ( this.props.size && this.props.size != 'textarea' && (this.props.size == 'sm' || this.props.size == 'lg' ) ) {
      props['className'] += ' form-control-' + this.props.size
    }

    // props = {...props, ...this.props}

    if (this.props.type == 'textarea') {
      if (this.props.rows != undefined) {
        props.rows = this.props.rows
      }

      dom = <textarea {...props} />
    } else {
      dom = <input {...props} />
    }

    return (
      <div className={this.state.className} style={this.props.style}>
        { dom }
        <i className="form-group__bar" />
      </div>
    )
  }
}
