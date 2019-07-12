import React, { Component } from 'react'
import Utils from '~/utils'
import classnames from 'classnames'

export default class Switch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toggled: props.on === true || props.off === false || false,
      form: props.form
    }

    this.utils = new Utils()

  }

  componentDidMount() {
    let value = this.props.on === true || this.props.off === false || false

    if (this.props.form) {
      let name = this.props.form
      let formObject = this.utils.getState().dashboard.form[name]
      value = formObject[this.props.id]
      // console.log(value)
    }

    this.setState({toggled: value})
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.on != nextProps.on || this.props.off != nextProps.off) {
      this.setState({toggled: nextProps.on === true || nextProps.off === false || false})
    }
    return true
  }
  
  handleEvent(toggle) {
    this.setState({toggled: toggle})
  }

  toggle() {
    this.state.toggled ? this.setState({toggled: false}) : this.setState({toggled: true})
  }

  render() {
    let classes = {
      'toggle-switch': true,
    }
    classes['toggle-swtich--' + this.props.color] = this.props.color
    let className = classnames(classes)
    
    let inputProps = {
      checked: this.props.on === true || this.props.off === false || false,
      disabled: this.props.disabled,
    }

    inputProps.onChange = () => {
      if (this.props.onChange != undefined) {
        this.props.onChange(!this.state.toggled)
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
        <div className={className}  >
          <input type="checkbox" className="toggle-switch__checkbox" {...inputProps} />
          <i className="toggle-switch__helper" />
        </div>
        {label}
      </div>
    )

  }
}
