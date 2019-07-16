import React, { Component } from 'react'
import classnames from 'classnames'
import Utils from '~/utils'
import { connect } from 'react-redux'

class Text extends Component {
  constructor(props) {
    super(props)

    this.utils = new Utils()
    this.state = {
      name: undefined,
      selfManaged: false
    }
  }

  componentDidMount() {
    let selfManaged = !this.props.form && !this.props.id
    
    let action = {
      name: this.props.form,
      id: this.props.id
    }
    
    let update = {
      error: this.props.error,
      name: action.name,
      selfManaged: selfManaged
    }

    if (selfManaged) {
      update.name = this.utils.getFormCounter()

      this.utils.dispatch('FORM_INIT', action).then(() => {
        this.setState(update)
      })
    } else {
      this.setState(update)
    }
  }

  handleChange(e) {
    let action = {
      name: this.state.name,
      id: this.props.id,
      value: e.target.value
    }

    this.utils.dispatch('FORM_VALUE_UPDATE', action).then(() => {
      if (this.props.onChange) {
        this.props.onChange(action.value)
      }
    })
  }

  handleFocus() {
    if (this.props.onFocus) {
      this.props.onFocus()
    }
  }

  handleBlur() {
    if (this.props.onBlur) {
      this.props.onBlur()
    }
  }

  render() {
    let dom
    let value = this.props.value
    let errorComponent = null

    if (this.state.selfManaged && this.props.formData) {
      value = this.props.formData[this.state.name].value || this.props.value
    }

    let props = {
      value: value,
      onChange: (e) => this.handleChange(e),
      onFocus: () => this.handleFocus(),
      onBlur: () => this.handleBlur(),
      className: classnames({
        'form-control': true,
        'textarea-autosize': this.props.type === 'textarea',
        'is-invalid': this.props.error,
      }),
      type: 'text',
      placeholder: this.props.placeholder,
      disabled: this.props.disabled
    }

    if ( this.props.size && this.props.size != 'textarea' && (this.props.size == 'sm' || this.props.size == 'lg' ) ) {
      props['className'] += ' form-control-' + this.props.size
    }

    if (this.props.type == 'textarea') {
      if (this.props.rows != undefined) {
        props.rows = this.props.rows
      }

      dom = <textarea {...props} />
    } else {
      dom = <input {...props} />
    }

    if (this.props.error) {
      errorComponent = <i className="form-group__feedback zmdi zmdi-close-circle"></i>
    }

    return (
      <div className="form-group" style={this.props.style}>
        { dom }
        { errorComponent }
        <i className="form-group__bar" />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return Utils.inputMapStateToProps(state, ownProps, '')
}

export default connect(mapStateToProps)(Text)
