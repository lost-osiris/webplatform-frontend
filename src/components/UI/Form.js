import React, { Component } from 'react'
import { Inputs } from '~/components'
import moment from 'moment'
// import _ from 'lodash'

class Form extends Component {
  constructor(props) {
    super(props)
    this.formName = props.name
    this.state = {
      errors: null,
      form: props.form,
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

  onSubmit({props}) {
    return this.props.onSubmit(...props)
  }

  handleChange({props}) {
    return this.props.handleChange(...props)
  }

  // UNSAFE_componentWillUpdate(nextProps, nextState) {
  //   let stateObj = nextState
  //
  //   stateObj = {
  //     ...nextState,
  //     errors: nextProps.error,
  //   }
  //
  //   // special handler for nested form components
  //   // the errors need to triggle down from the parent Form components
  //   // that means errors aren't coming from state but rather props
  //   // if (nextState.errors == null && nextProps.error) {
  //   //   stateObj = {
  //   //     ...nextState,
  //   //     errors: nextProps.error
  //   //   }
  //   // }
  //
  //   this.initElements = this.findElements(nextProps.children, stateObj)
  // }

  findElements(dom, state) {
    if (dom.constructor === Object) {
      /*
        dom doesn't have any children but still has props.
        checking if it's a label or some kind of input dom.
        Either way it still calls setupElement which returns the dom back with
        an onChange event added if it's an input dom
      */
      if (dom.props != undefined && dom.props['data-label'] != undefined) {
        // when dom is a label element
        return this.setupElement(dom, dom.props['data-label'], state)
      } else if (dom.props.id != undefined) {
        // when dom is an input element
        return this.setupElement(dom, dom.props.id, state)
      } else if (dom.props != undefined && dom.props.type == 'submit') {
        // when dom is the submit handler
        return this.setupOnSubmit(dom)
      }

      /* most dom's will come in as an object where it can have an arry
      or an object as children. The child is passed back into this function.
      If the child is a single come it will come back in as an Object if it
      has more then one child it will come in as an Array  */
      if (dom.props != undefined && dom.props.children != undefined) {
        // Avioding recursive call when the child is a String
        if (dom.props.children.constructor === String) {
          return React.cloneElement(dom, dom.props)
        } else {
          let newDom = this.findElements(dom.props.children, state)
          return React.cloneElement(dom, dom.props, newDom)
        }
      }

      // console.log(dom.props.children)
      // when all other cases are tested just return current dom
      return dom
      // return React.cloneElement(dom, dom.props)

    } else if (dom.constructor === Array) {

      // when component has more then one child the whole child array will be passed in
      let elements = []

      for (let i in dom) {
        // when child of a dom is a string don't make recusive call
        if (typeof dom[i] === 'string') {
          elements.push(dom[i])
          continue
        }

        let newDom = this.findElements(dom[i], state)
        let e = React.cloneElement(newDom, {key: i})

        elements.push(e)
      }

      return elements
    }
  }

  setupElement(dom, name, state) {
    let props = this.setupElementProps(dom, name, state)
    return React.cloneElement(dom, props, props.children)
  }

  setupElementProps(dom, name, state) {
    let props = {...dom.props}

    if (dom.type == 'label') {
      // console.log(this.formName, name, state.errors)
      if (state.errors != null && state.errors[name]) {
        if (props.className == undefined) {
          props.className = 'has-error'
        } else {
          props.className += ' has-error'
        }
      }
    } else {
      // special case for when form contains an Autocomplete component
      if (dom.type == this.inputTypes.autoComplete) {
        props.searchText = this.state.form[name]
      } else if (dom.type == this.inputTypes.radioButton) {
        props.selectedValue = this.state.form[name]
      } else {
        props.value = this.state.form[name]
      }

      props.onChange = (data) => {
        // special case for when form contains an Autocomplete component
        if (dom.type == this.inputTypes.autoComplete) {
          this.form[name] = data.searchText
        // special case for when form contains an Switch or Check component
        } else if (dom.type == this.inputTypes.switch  || dom.type == this.inputTypes.check) {
          this.form[name] = data.target.checked
        } else if (dom.type == this.inputTypes.radioButton) {
          // radio input
          this.form[name] = data
        } else {
          // datetime input
          if (moment.isMoment(data)) {
            this.form[name] = data
          } else {
            this.form[name] = data.target.value
          }
        }

        if (this.handleChange != undefined) {
          this.handleChange(this.state.form, name)
        }

        if (dom.props != undefined && dom.props.onChange != undefined) {
          dom.props.onChange(data)
        }

        this.forceUpdate()
      }

      if (this.checkInputDom(dom)) {
        if (state.errors != null && state.errors[name]) {
          props.error = state.errors[name]
        } else {
          props.error = false
        }
      }
    }

    return props
  }

  setupOnSubmit(dom) {
    let props = {...dom.props}

    props.onClick = (e) => {
      if (dom.props != undefined && dom.props.onClick != undefined) {
        dom.props.onClick(e)
      }

      const errors = this.checkErrors(this.onSubmit(this.state.form))

      if (errors) {
        this.setState({errors: errors})
      } else {
        this.setState({errors: {}})
      }
    }

    return React.cloneElement(dom, props)
  }

  checkInputDom(dom) {
    const matches = Object.keys(this.inputTypes)
      .filter(input => this.inputTypes[input] === dom.type)

    return matches.length > 0
    // for (let i in this.inputTypes) {
    //   let type = this.inputTypes[i]
    //
    //   if (dom.type === type) {
    //     return true
    //   }
    // }
    //
    // return false
  }

  checkErrors(errors) {
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
    const FormElements = () => this.findElements(this.props.children, this.state)
    return <FormElements />
  }
}

export default Form
