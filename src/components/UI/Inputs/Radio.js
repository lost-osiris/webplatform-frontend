import React, { Component } from 'react'
// import classnames from 'classnames'

/**
  Props:
    - name: The name of the radio group
    - selectedValue: Value of the currently selected radio
    - itemRenderer: Function for rendering a radio input with a specific layout (default is a div wrapper)
    - margin: Bottom margin
    - inline: Whether radio buttons should appear on the same line
*/
export class Radio extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value || '',
    }
  }

  renderChildren() {
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
        const onChange = (this.props.onChange !== undefined) ? this.props.onChange : child.props.onChange
        return renderer(
          <RadioButton
            {...this.props}
            label={label}
            value={value}
            onChange={() => onChange(value)}
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
          onClick={() => this.props.onChange()}>
          {label}
        </label>
      </div>
    )
  }
}
