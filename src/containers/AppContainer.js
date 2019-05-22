import React from 'react'
import { connect } from 'react-redux'
import Cookies from 'universal-cookie'
import Utils from '~/utils'
import { Layout } from '~/components/Core/Layout'
import Loading from '~/components/Core/Loading'

class AppContainer extends React.Component {
  constructor(props) {
    super(props)
    this.reducer = 'dashboard'
    this.utils = new Utils(this.reducer)
    this.state = {
      layout: {},
      loadingComponents: true,
      location: {}
    }
  }

  componentDidMount() {
    if (this.utils.getUser() == undefined) {
      let cookies = new Cookies()
      let user = cookies.get('login')

      let apis = {
        user: {
          path: 'users.get',
          data: {
            kerberos: user,
          },
        },
        systemInfo: {
          path: 'system.info',
        },
      }

      this.utils.request(apis).then((data) => {
        data.user.then((user) => {
          data.systemInfo.then((info) => {
            this.utils.dispatch('LOADED', {user: user, systemInfo: info})
            // this.fetchLayout(this.props, true)
          })
        })
      })
    }
  }

  componentDidUpdate() {
    if ((this.state.loadingComponents ||
      this.props.location.key !== this.state.location.key) &&
      this.utils.getUser() && this.props.layout.navs !== undefined
    ){
      this.fetchLayout(this.props)
    }
  }

  fetchLayout(props) {
    let keys = [
      'stateTitle',
      'content',
      'appNav',
      'search',
    ]

    let promises = []

    for (let i in props.layout.api) {
      let api = props.layout.api[i]

      if (api) {
        promises.push(api())
      }
    }

    let map = {}
    let count = promises.length

    for (let i in keys) {
      let k = keys[i]
      let component = props.layout.ui[k]

      if (component) {
        promises.push(component())
        map[count] = k
        count++
      }
    }

    Promise.all(promises).then((data) => {
      let ui = {}
      for (let i in map) {
        let module = data[parseInt(i)]

        ui[map[i]] = module

        if (module.default) {
          ui[map[i]] = module.default
        }
      }

      let layout = {...props.layout}
      layout.ui = ui

      this.setState({loadingComponents: false, layout: layout, location: props.location})
    })
  }

  render() {
    if (this.utils.getUser() === undefined && this.state.layout.navs === undefined) {
      return <Loading message="Loading user data..." className="page-loader__main" toggle={true} />
    }

    let newProps = {...this.state.layout}
    if (!newProps.location) {
      newProps.location = this.props.location
    }

    return (
      <Layout
        loadingComponents={this.state.loadingComponents}
        loadingAPI={this.props.loadingAPI}
        {...newProps }
      />
    )
  }
}

const mapStateToProps = (state) => {
  let apis = state.dashboard.loading
  let loading = false

  for (let i in apis) {
    if (apis[i] && (i != 'users.get' || i != 'system.info')) {
      loading = true
    }
  }

  return {
    user: state.dashboard.user,
    systemInfo: state.dashboard.systemInfo,
    loadingAPI: loading,
  }
}

export default connect(mapStateToProps)(AppContainer)
