
import React, { Component } from 'react'
import { Inputs } from '~/components'
import moment from 'moment'

export default class Form extends Component {
  constructor(props) {
    super(props)
    this.formName = props.name

    let inputComponents = {}
    Object.keys(props.form).forEach((key) => {
      inputComponents[key] = null
    })

    this.state = {
      errors: null,
      form: props.form,
      setup: false,
      formComponents: {},
      inputComponents: inputComponents,
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
    let inputComponents = {}
    let formComponents = this.buildTree(this.props.children, inputComponents)

    console.log(formComponents, inputComponents)
    console.log(this.renderForm(formComponents))

    let newState = {
      form: this.props.form,
      formComponents: formComponents,
      errors: this.props.errors,
    }

    this.setState(newState)
  }

  /**
   * Recursive function that builds a data structure representing the dom
   * that can be easily indexed
   * 
   * @param {object} dom - dom to recursivley build tree from
   * 
   * @returns object/tree representation of the specified component and its sub-components (children)
   */
  buildTree(dom, inputComponents) {
    if (dom && dom.constructor === Object) {
      let component = dom
      if (dom.props != undefined && dom.props['label-id'] != undefined) {
        component = this.setupElement(dom, dom.props['label-id'])
      }
      else if (dom.props['input-id'] != undefined) {
        let name = dom.props['input-id']
        component = this.setupElement(dom, dom.props['input-id'])
        inputComponents[name] = component
        
        return {component: inputComponents[name], children: null}
      } 

      let children = []
      if (typeof component.props.children == typeof Array) {
        children = component.props.children.map((child) => {
          return this.buildTree(child, inputComponents)
        })
      } else if (component.props.children) {
        children.push(this.buildTree(component.props.children, inputComponents))
      }

      return {component: component, children: children}
      
      // else if (dom.props != undefined && dom.props.type == 'submit') {
      //   return this.setupOnSubmit(dom)
      // }
    } else if (dom && dom.constructor === Array) {

      let elements = []
      for (let i in dom) {
        if (typeof dom[i] === 'string') {
          elements.push({component: dom[i], children: null})
          continue
        }
        
        elements.push(this.buildTree(dom[i], inputComponents))
      }

      return {component: null, children: elements}
    } else if (dom && typeof dom === 'string') {
      return dom
    }
  }

  renderForm(formComponents) {
    // If form component to render is an object
    if (typeof formComponents === typeof Object) { 
      // First component is of type null, skip it
      if (formComponents.component === null && formComponents.children) {
        return this.renderForm(formComponents.children)
      }
      else if (formComponents.children === null) {
        return formComponents.component
      } 
      else {
        return this.renderForm(formComponents.children)
      }
    }
    // If form component is an array with at least one child
    else if (formComponents.children) {
      return formComponents.children.map((component) => {
        return React.createElement(this.renderForm(component))
      })
    } else {
      return formComponents.component
    }
  }
  
  getTree() {
    // let components = this.state.formComponents

    // if (this.state.setup) {
    //   return this.state.formComponents
    // }

    // return this.buildTree(this.props.children)
  }

  setupElement(dom, name) {
    let props = this.setupElementProps(dom, name)

    switch (dom.type) {
      case this.inputTypes.autoComplete:
        return <Inputs.Autocomplete {...props} />

      case this.inputTypes.text:
        return <Inputs.Text {...props} />

      case this.inputTypes.switch:
        return <Inputs.Switch {...props} />

      case this.inputTypes.select:
        return <Inputs.Select {...props} />

      case this.inputTypes.radioButton:
        return <Inputs.RadioButton {...props} />

      case this.inputTypes.check:
        return <Inputs.Check {...props} />

      case this.inputTypes.dateTime:
        return <Inputs.DateTime {...props} />
      
      default: 
        return dom
    }
  }

  setupElementProps(dom, name) {
    let props = {...dom.props}

    if (dom.type == 'label') {
      if (this.state.errors != null && this.state.errors[name]) {
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

        console.log('about to update state with', form)
        this.setState({form: form})
      }

      // if (this.checkInputDom(dom)) {
      //   if (this.state.errors != null && this.state.errors[name]) {
      //     props.error = this.state.errors[name]
      //   }
      //   else {
      //     props.error = false
      //   }
      // }
    }

    return props
  }

  render() {
    // return this.getTree()
    // // this.buildTree(this.props.children)
    return <h1>TEST</h1>
  }
}