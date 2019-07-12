import React, { Component } from 'react'
import classnames from 'classnames'
import Utils from '~/utils'

export default class Input extends Component {
  constructor(props) {
    super(props)

    this.utils = new Utils()

    let className = classnames({
      'form-group__bar': true,
      'has-error': props.error
    })

    this.state = {
      value: undefined,
      className: className,
      error: props.error,
      form: props.form
    }
  }

  componentDidMount() {
    let className = classnames({
      'form-group': true,
      'has-error': this.props.error
    })

    let value = this.props.value || ''

    if (this.props.form) {
      let name = this.props.form
      let formObject = this.utils.getState().dashboard.form[name]

      value = formObject[this.props.id]
    }

    this.setState({
      className: className,
      value: value,
      error: this.props.error,
    })
  }

  componentDidUpdate(prevProps) {
    let stateOjbect = this.utils.getState()
    // console.log(stateOjbect)
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
    
    if (!this.props.form) {
      if (this.props.value === prevProps.value && this.state.value !== prevProps.value) {
        hasUpdate = true
        update['value'] = this.props.value
      }
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

    if (this.props.form) {
      let action = {
        name: this.props.form,
        id: this.props.id,
        value: e.target.value
      }

      this.utils.dispatch('FORM_VALUE_UPDATE', action).then(() => {
        let stateObject = this.utils.getState()
        this.setState({value: stateObject.dashboard.form[this.props.form][this.props.id]})
      })
    } else {
      this.setState({value: e.target.value})
    }
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

    let stateObject = this.utils.getState()
    let dom
    let valueProp

    if (this.props.form) {
      valueProp = stateObject.dashboard.form[this.props.form][this.props.id]
    } else if (this.props.value) {
      valueProp = this.props.value
    } else {
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
      disabled: this.props.disabled
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
