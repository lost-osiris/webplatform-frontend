import React, { Component } from 'react'
import { Inputs } from '~/components'
import moment from 'moment'
// import _ from 'lodash'

// FIXME: Text loses focus on first typing
// FIXME: Submit button not being picked up
// TODO: Error handling

class Form extends Component {
  constructor(props) {
    super(props)
    this.formName = props.name
    this.state = {
      errors: null,
      form: props.form,
      setup: false,
      formComponents: {}
    }

    this.inputTypes = {
      autoComplete: <Inputs.Autocomplete />.type,
      text: <Inputs.Text />.type,
      switch: <Inputs.Switch />.type,
      radioButton: <Inputs.RadioButton />.type,
      check: <Inputs.Check />.type,
      dateTime: <Inputs.DateTime />.type,
      select: <Inputs.Select />.type,
    }
  }

  componentDidMount() {
    // console.log(this.props.form)
    let elements = this.findElements(this.props.children, this.state)
    // let elements = []
    this.setState({form: this.props.form, setup: true, elements: elements})
  }

  componentDidUpdate() {
    // let stateForm = Object.keys(this.state.form)
    // let check = stateForm.filter((key) => {
    //   console.log(key, this.props.form[key], this.state.form[key])
    //   return this.props.form[key] === this.state.form[key]
    // })
    // // console.log(check, this.props.form, this.state.form)
    
    // if (check.length !== stateForm.length) {
    //   console.log('fuck')
    // //   this.setState({form: this.props.form})
    // }
  }

  // setup() { 
  //   this.onSubmit = this.props.onSubmit
  //   this.handleChange = this.props.onChange
  // }

  // onSubmit({props}) {
  //   return this.props.onSubmit(...props)
  // }

  // handleChange({props}) {
  //   return this.props.handleChange(...props)
  // }

  /**
   * Recursivley traverses the dom cloning the elements to be used within the form component.
   * 
   * @param {object} dom - Children of the sepcified component (typically a collection of sub components) TODO: Reword
   * @param {object} state - Current state of the form component (this.state)
   */
  findElements(dom, state) {
    // console.log(dom.type, dom.props)
    if (dom.constructor === Object) {
      /*
        dom doesn't have any children but still has props.
        checking if it's a label or some kind of input dom.
        Either way it still calls setupElement which returns the dom back with
        an onChange event added if it's an input dom
      */
      // when dom is a label element
      if (dom.props != undefined && dom.props['label-id'] != undefined) {
        return this.setupElement(dom, dom.props['label-id'], state)
      }
      // when dom is an input element
      else if (dom.props['input-id'] != undefined) {
        if (this.state.setup) {
          return this.state.formComponents[dom.props['input-id']]  
        }
        
        return this.setupElement(dom, dom.props['input-id'], state)
      }
      // when dom is the submit handler
      else if (dom.props != undefined && dom.props.type == 'submit') {
        return this.setupOnSubmit(dom)
      }

      /* most dom's will come in as an object where it can have an arry
      or an object as children. The child is passed back into this function.
      If the child is a single come it will come back in as an Object if it
      has more then one child it will come in as an Array  */
      if (dom.props != undefined && dom.props.children != undefined) {
        // Avioding recursive call when the child is a String
        if (dom.props.children.constructor === String) {
          return dom
          // return React.cloneElement(dom, dom.props)
        } else {
          // let newDom = this.findElements(dom.props.children, state)

          let children = React.Children.map(dom.props.children, (child) => {
            return this.findElements(child, state)
          })

          // console.log(children)
          // return children
          return React.createElement(dom.type, dom.props, children)
        }
      }

      // console.log(dom.props.children)
      // when all other cases are tested just return current dom
      return dom
      // return React.cloneElement(dom, dom.props)

    } else if (dom.constructor === Array) {

      // when component has more then one child the whole child array will be passed in
      let elements = []
      // console.log(dom)
      for (let i in dom) {
        // when child of a dom is a string don't make recusive call
        if (typeof dom[i] === 'string') {
          elements.push(dom[i])
          continue
        }

        let newDom = this.findElements(dom[i], state)
        // let e = React.cloneElement(newDom, {key: 'form-' + i})
        // let e = React.cloneElement(newDom)
        // console.log(e)
        // elements.push(e)
        elements.push(newDom)
      }

      return elements
    }
  }

  setupElement(dom, name, state) {
    let props = this.setupElementProps(dom, name, state)
    let inputComponent = null
    switch (dom.type) {
      case this.inputTypes.autoComplete:
        inputComponent = <Inputs.Autocomplete {...props} />
        break

      case this.inputTypes.text:
        inputComponent = <Inputs.Text {...props} />
        break

      case this.inputTypes.switch:
        inputComponent = <Inputs.Switch {...props} />
        break

      case this.inputTypes.select:
        inputComponent = <Inputs.Select {...props} />
        break

      case this.inputTypes.radioButton:
        inputComponent = <Inputs.RadioButton {...props} />
        break

      case this.inputTypes.check:
        inputComponent = <Inputs.Check {...props} />
        break

      case this.inputTypes.dateTime:
        inputComponent = <Inputs.DateTime {...props} />
        break

      default:
        return dom
    }

    let form = this.state.formComponents
    form[name] = inputComponent
    
    if (this.state.setup) {
      this.setState({formComponents: form})
    }

    return inputComponent

    // if (dom.type === this.inputTypes.autoComplete) {
    //   return <Inputs.Autocomplete {...props} />
    // } else if (dom.type === this.inputTypes.text) {
    //   return <Inputs.Text {...props} />
    // }
    // props.key = props['input-id']
    // console.log(props)
    // if (this.state.setup) {
    //   dom.props = props
    //   return dom
    // }
    // } else if (dom.type === this.inputTypes.) {
    //   return <Inputs.Text {...props} />
    // }

    // return React.cloneElement(dom, props, props.children)
  }

  setupElementProps(dom, name, state) {
    
    let props = {...dom.props}

    if (dom.type == 'label') {
      // console.log(this.formName, name, state.errors)
      if (state.errors != null && state.errors[name]) {
        if (props.className == undefined) {
          props.className = 'has-error'
        }
        else {
          props.className += ' has-error'
        }
      }
    } else {
      // special case for when form contains an Autocomplete component
      if (dom.type == this.inputTypes.autoComplete) {
        props.searchText = this.state.form[name]
      }
      // special case for when form contains an radio button component
      else if (dom.type == this.inputTypes.radioButton) {
        props.selectedValue = this.state.form[name]
      }
      else if (dom.type == this.inputTypes.switch) {
        props.on = this.state.form[name]
      }
      else {
        props.value = this.state.form[name]
      }

      props.onChange = (data) => {

        let form = this.state.form

        // special case for when form contains an Autocomplete component
        if (dom.type == this.inputTypes.autoComplete) {
          form[name] = data.searchText
        // special case for when form contains an Switch or Check component
        }
        else if (dom.type == this.inputTypes.switch  || dom.type == this.inputTypes.check) {
          // this.form[name] = data.target.checked
          form[name] = data
        }
        else if (dom.type == this.inputTypes.radioButton) {
          // radio input
          form[name] = data
        }
        else {
          // datetime input
          if (moment.isMoment(data)) {
            form[name] = data
          } else {
            form[name] = data 
          }
        }

        if (this.handleChange != undefined) {
          this.handleChange(this.state.form, name)
        }

        if (dom.props != undefined && dom.props.onChange != undefined) {
          dom.props.onChange(data)
        }

        // this.forceUpdate()
        console.log('about to update state with', form)
        this.setState({form: form})
      }

      if (this.checkInputDom(dom)) {
        if (state.errors != null && state.errors[name]) {
          props.error = state.errors[name]
        }
        else {
          props.error = false
        }
      }
    }

    return props
  }

  setupOnSubmit(dom) {
    console.log('Setting up onSubmit')
    let props = {...dom.props}

    props.onClick = (e) => {
      if (dom.props != undefined && dom.props.onClick != undefined) {
        dom.props.onClick(e)
      }

      const errors = this.checkErrors(this.onSubmit(this.state.form))

      if (errors) {
        this.setState({errors: errors})
      }
      else {
        this.setState({errors: {}})
      }
    }

    return React.cloneElement(dom, props)
  }

  checkInputDom(dom) {
    const matches = Object.keys(this.inputTypes)
      .filter(input => this.inputTypes[input] === dom.type)

    return matches.length > 0
  }

  /**
   * Checkes the specified array for errors and returns back an
   * object containing the form areas with errors
   * 
   * @param {array} errors - Array of errors for the component
   */
  checkErrors(errors) {
    console.log('Check Errors Call')
    let output = {}
    let found = false
    for (let i in errors) {
      if (errors[i]) {
        output[i] = errors[i]
        found = true
      }
    }

    if (found) {
      return output
    }

    return false
  }

  render() {
    console.log('RENDERING FORM')
    if (this.state.setup) {
      // console.log(this.state.elements)
      return this.state.elements
    } else {
      return <p />
    }
    // const FormElements = () => this.findElements(this.props.children, this.state)
    // return <FormElements />
  }
}

export default Form
