import React, { Component } from 'react'

export default class Switch extends Component {
  constructor(props) {
    super(props)
    this.setup(this.props)
    this.state = {
      toggled: props.on === true || props.off === false || false,
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.on != nextProps.on || this.props.off != nextProps.off) {
      this.setState({toggled: nextProps.on === true || nextProps.off === false || false})
    }
    return true
  }
  
  setup(props) {
    this.className = 'toggle-switch'
    this.onChange = props.onChange
    this.error = props.error
    this.color = undefined
    this.disabled = ''
    this.alignment = props.textAlign
    this.label = props.label

    if (props.color != undefined) {
      this.className += ' toggle-switch--' + props.color
    }

    if (props.disabled != undefined &&
      typeof props.disabled === 'boolean' &&
      props.disabled) {
      this.disabled = 'disabled'
    }
  }

  handleEvent(toggle) {
    this.setState({toggled: toggle})
  }

  toggle() {
    this.state.toggled ? this.setState({toggled: false}) : this.setState({toggled: true})
  }

  render() {
    this.setup(this.props)

    let inputProps = {
      checked: this.state.toggled,
      disabled: this.props.disabled,
    }

    inputProps.onChange = (e) => {
      this.handleEvent(!this.state.toggled)
      if (this.onChange != undefined) {
        this.onChange(e)
      }

      this.toggle()
    }

    //Conditionally create label if one is supplied in props
    let label
    if (this.props.label != undefined) {
      label = <label>{this.props.label}</label>
    }

    return (
      <div className="switch-container" style={{display: 'inline-block'}}>
        <div className={this.className}  >
          <input type="checkbox" className="toggle-switch__checkbox" {...inputProps} />
          <i className="toggle-switch__helper" />
        </div>
        {label}
      </div>
    )

  }
}
