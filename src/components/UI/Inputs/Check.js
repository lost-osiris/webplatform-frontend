import React, { Component } from 'react'
import { connect } from 'react-redux'
import Utils from '~/utils'
import classnames from 'classnames'
import PropTypes from 'prop-types'

class Check extends Component {
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
      name: action.name,
      selfManaged: selfManaged
    }

    // If the component does not specify name and id self managed
    if (selfManaged) {
      // And use its form counter as the form name
      update.name = this.utils.getFormCounter()

      this.utils.dispatch('FORM_INIT', action).then(() => {
        this.setState(update)
      })
    }
    else {
      this.setState(update)
    }
  }

  /**
   * Toggles the switch. This fuction toggles the switch
   * between the off (false) and on (true) position.
   */
  toggle(e) {
    let action = {
      name: this.state.name,
      id: this.props.id,
      value: !e.target.checked
    }

    this.utils.dispatch('FORM_VALUE_UPDATE', action).then(() => {
      if (this.props.onChange) {
        this.props.onChange(!e.target.checked)
      }
    })

  }

  render() {
    let value = this.props.value

    if (this.state.selfManaged && this.props.formData) {
      value = this.props.formData[this.state.name].value || this.props.value
    }

    let classes = {
      'checkbox': true,
      'checkbox--inline': this.props.inline,
    }
    let className = classnames(classes)
    
    let inputProps = {
      disabled: this.props.disabled,
    }

    let labelProps = {
      checked: value,
      'data-checked': value,
      'style': this.props.style
    }

    labelProps.onClick = (e) => {
      if (this.props.onChange != undefined) {
        this.props.onChange(!e.target.checked)
      }
      this.toggle(e)
    }

    //Conditionally create label if one is supplied in props
    let label
    if (this.props.label != undefined) {
      label = (
        <label className="checkbox__label" {...labelProps} >
          { this.props.label }
        </label>
      )
    }


    return (
      <div className={className}>
        <input type="checkbox" {...inputProps} />
        {label}
      </div>
    )

  }
}

const mapStateToProps = (state, ownProps) => {
  return Utils.inputMapStateToProps(state, ownProps, false)
}

Check.propTypes = {
  value: PropTypes.bool,    // Value to set the state of the switch. true for checked, false for unchecked
  form: PropTypes.string,     // Name of the form the component belongs to. Checks global state for said form and makes association
  id: PropTypes.string,       // Identifier for the switch. The name of the switch component in the larger form (example: id=isGlobal)
}

export default connect(mapStateToProps)(Check)