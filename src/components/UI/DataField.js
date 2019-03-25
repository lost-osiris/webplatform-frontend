import React from 'react'
import { FormatDate } from '~/components'

export default class DataField extends React.Component {
  constructor(props) {
    super(props)
  }

  setup(props) {
    if (!props.data) {
      console.error('Data props weren\'t passed into DataField component.')
    }

    let fields = []
    for (let i in props.fields) {
      let label = props.fields[i]
      let value = i

      if (label instanceof Object) {
        value = props.fields[i]
        label = props.fields[i].title
      }

      fields.push(this.renderField(label, value, props, i))
    }

    return fields
  }

  getValue(key, data) {
    let Output = null
    if (key.indexOf('.') > 0) {
      let keys = key.split('.')
      for (let i in keys) {
        Output = data[keys[i]]
        data = Output
      }
    } else {
      Output = data[key]
    }

    if (typeof Output === 'function') {
      return <Output />
    } else if (Output) {
      return Output
    }

    return 'None'
  }

  renderField(label, value, props, index) {
    let FieldValue = (props) => {
      let value = props.value

      if (props.render) {
        let renderProps = {
          value: value,
          label: label,
          data: props.data
        }
        return <dd className="col"><props.render {...renderProps} /></dd>
      }

      if (typeof props.value === 'object') {
        if (props.value.key instanceof Array) {
          let tmp = ''
          for (let i in props.value.key) {
            let key = props.value.key[i]

            if (props.value.delimiter) {
              tmp += this.getValue(key, props.data) + props.value.delimiter
            } else {
              tmp += this.getValue(key, props.data) + ' '
            }
          }

          value = tmp
        } else {
          value = this.getValue(props.value.key, props.data)
        }

        if (props.value.type === 'date') {
          let dateProps = {
            date: value
          }

          if (props.value.format) {
            dateProps.format = props.value.format
          }

          value = <FormatDate {...dateProps} />
        } else if (props.value.type === 'email') {
          value = (
            <a
              href={'mailto:' + value}
              target="_top"
            >
              { value }{' '}
            </a>
          )
        }
      } else {
        value = this.getValue(props.value, props.data)
      }

      return <dd className="col">{ value }</dd>
    }

    let fieldProps = {
      render: props.render,
      value: value,
      data: props.data
    }

    return (
      <dl key={index} className="row">
        <dt className="col">{ label }</dt>
        <FieldValue {...fieldProps} />
      </dl>
    )
  }

  render() {
    let Fields = () => this.setup(this.props)
    let icon = this.props.icon ? this.props.icon : 'info-outline'
    let title = this.props.title ? this.props.title : 'Data Field'

    return (
      <div className="pmb-block">
        <div className="pmbb-header">
          <h2>
            <span>
              <i className={`zmdi zmdi-${icon}`} /> { title }
            </span>
          </h2>
        </div>
        <div className="pmbb-body pl-5">
          <div className="pmbb-view">
            <Fields />
          </div>
        </div>
      </div>
    )
  }
}
