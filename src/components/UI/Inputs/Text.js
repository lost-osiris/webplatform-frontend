import React, { Component } from 'react'
import classnames from 'classnames'
import Utils from '~/utils'
import { connect } from 'react-redux'

class Text extends Component {
  constructor(props) {
    super(props)

    this.utils = new Utils()
    this.state = {
      selfManaged: false
    }
  }

  componentDidMount() {
    let action = {
      name: this.props.form,
      id: this.props.id
    }
    
    let update = {
      error: this.props.error,
      name: action.name
    }

    if (!action.name && !action.id) {
      update.selfManaged = true
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
      name: this.props.form,
      id: this.props.id,
      value: e.target.value
    }

    if (this.state.selfManaged) {
      action.name = this.state.name
    }

    this.utils.dispatch('FORM_VALUE_UPDATE', action).then(() => {
      if (this.props.onChange) {
        this.props.onChange(e.target.value)
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

    let className = classnames({
      'form-group': true,
    })

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
  let name = ownProps.form
  let value = ''
  let form = state.dashboard.form[name]
  let id = ownProps.id
  let error = false

  if (name && id) {
    if (form) {
      value = form[id]
      error = form.errors[id]
    }
  } else if (!name && id) {
    console.error('You specifed an id prop without specifiying a form prop. Form component requires both.')
  } else if (name && !id) {
    console.error('You specifed a form prop without specifiying an id prop. Form component requires both.')
  } else {
    if (ownProps.value) {
      value = ownProps.value
    }
  }

  return {value: value, formData: state.dashboard.form, error: error}
}

export default connect(mapStateToProps)(Text)
