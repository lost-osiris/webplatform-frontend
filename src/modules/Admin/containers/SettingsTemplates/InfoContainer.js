import React, { Component } from 'react'
import TemplateInfo from '../components/Info'
import Utils from '~/utils'
import { Loading } from '~/components'

class InfoContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()
    this.state = {
      loading: false,
      template: {},
    }
  }

  componentWillMount() {
    const api = {
      path: 'settings.templates.get',
      data: {
        name: this.props.match.params.name,
      }
    }

    this.setState({ loading: true })
    this.utils.request(api).then(data => {
      this.setState({
        loading: false,
        template: data,
      })
    })
  }

  render() {
    return (
      this.state.loading ? <Loading /> : (
        <TemplateInfo
          template={this.state.template}
        />
      )
    )
  }
}

export default InfoContainer
