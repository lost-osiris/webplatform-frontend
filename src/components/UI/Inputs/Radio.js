import React, { Component } from 'react'
import { connect } from 'react-redux'
import Utils from '~/utils'
// import classnames from 'classnames'

/**
  Props:
    - name: The name of the radio group
    - selectedValue: Value of the currently selected radio
    - itemRenderer: Function for rendering a radio input with a specific layout (default is a div wrapper)
    - margin: Bottom margin
    - inline: Whether radio buttons should appear on the same line
*/
class RadioContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: undefined,
    }

    this.utils = new Utils()
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
        action.name = update.name
        action.value = this.props.children[0].props.value

        this.utils.dispatch('FORM_VALUE_UPDATE', action).then(() => {
          this.setState(update)
        })
      })
    }
    else {
      this.setState(update)
    }
  }

  handleChange(value) {
    let action = {
      name: this.state.name,
      id: this.props.id,
      value: value 
    }

    this.utils.dispatch('FORM_VALUE_UPDATE', action).then(() => {
      if (this.props.onChange) {
        this.props.onChange(value)
      }
    })
  }

  renderChildren() {
    let selectedValue = this.props.value
    if (this.state.selfManaged && this.props.formData) {
      selectedValue = this.props.formData[this.state.name].value || this.props.value
    }

    const { itemRenderer } = this.props
    const renderer =
      typeof itemRenderer === 'function'
        ? itemRenderer
        : radio => (
          radio
        )

    return React.Children.map(
      this.props.children,
      child => {
        const { value, label } = child.props
        const onChange = this.handleChange
        return renderer(
          <RadioButton
            selectedValue={selectedValue}
            label={label}
            value={value}
            onChange={() => this.handleChange(value)}
          />
        )
      },
      this
    )
  }

  render() {
    return (
      this.renderChildren()
    )
  }
}

/**
  Props:
    - value
    - label
    - id (required so that Form component can find this component and set the onChange handler properly)
*/
export class RadioButton extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      name,
      label,
      value,
      selectedValue,
      inline,
      // margin,
      id,
    } = this.props
    // const radioClass = classnames({
    //   radio: true,
    //   'radio-inline': inline,
    //   'm-b-15': !margin,
    //   [`m-b-${margin}`]: !isNaN(margin),
    // })

    let className = 'radio'
    if (inline) {
      className += ' radio--inline'
    }

    return (
      <div className={className}>
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
        />
        <label className="radio__label"
          data-checked={value === selectedValue}
          onClick={() => this.props.onChange(this.props.value)}>
          {label}
        </label>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return Utils.inputMapStateToProps(state, ownProps, false)
}

const Radio = connect(mapStateToProps)(RadioContainer)

export { Radio } 
