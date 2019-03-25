import Main from '../components/Main'
import React, {Component} from 'react'
import Utils from '~/utils'
import { Loading } from '~/components'

class MainContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      templates: [],
    }
    this.utils = new Utils()
  }

  componentDidMount() {
    this.getTemplates()
  }

  getTemplates() {
    let api = {
      path: 'settings.templates.list',
    }

    this.setState({ loading: true })
    this.utils.request(api).then(data => {
      this.setState({
        templates: data,
        loading: false,
      })
    })
  }

  removeTemplate(tId) {
    let api = {
      path: 'settings.templates.remove',
      data: {
        id: tId
      },
    }

    this.utils.request(api).then((data) => {
      if (data != undefined) {
        this.getTemplates()
      }
    })
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    }

    return (
      <Main templates={this.state.templates} removeTemplate={(tId) => this.removeTemplate(tId) } />
    )
  }
}

export default MainContainer
