import React, { Component } from 'react'
import { connect } from 'react-redux'
import qs from 'query-string'
import { ConnectedRouter } from 'connected-react-router'

import Utils from '~/utils'
import Routes from '~/routes'

import AppContainer from '~/containers/AppContainer'
import MainRoutes from '~/modules/Main/components/UI'

class Router extends Component {
  constructor(props) {
    super(props)
    this.history = props.history
    this.utils = new Utils()

    this.state = {
      layout: undefined,
      loading: false,
      location: props.history.location,
    }
  }

  componentDidMount() {
    this.setupRoutes(Routes).then((routes) => {
      let layout = this.getLayout(this.history.location, routes)

      this.props.history.listen((location) => this.updateLayout(location))

      this.setState({
        routes: routes,
        layout: layout,
        location: this.props.history.location,
      })
    })
  }

  componentDidUpdate() {
    var errorLayout = this.checkErrors()
    if (this.error && !this.error.thrown) {
      this.error.thrown = true
      this.utils.dispatch('API_FAILURE_THROWN', {index: this.error.index})
      this.setState({layout: errorLayout, location: this.history.location})
    }
  }

  updateLayout(location) {
    let stateObj = this.utils.getState()

    if (stateObj.dashboard.sideNavToggled) {
      this.utils.dispatch('DASHBOARD_TOGGLE_SIDENAV_OFF')
    }

    this.setState({
      layout: this.getLayout(location, this.state.routes),
      location: location,
    })
  }

  getLayout(location, routes) {
    let found = []
    for (let i in routes) {
      let layout = routes[i]
      let url = location.pathname

      let match = this.utils.match(url, layout.match)

      layout.parsedMatch = match

      if (match != null) {
        found.push(layout)
      }
    }

    for (let i in found) {
      let route = found[i]
      if (route.parsedMatch.isExact) {
        return this.setupLayout(route)
      }
    }

    return this.setupLayout(found[0])
  }

  setupLayout(route) {
    let match = route.parsedMatch
    let query = qs.parse(this.history.location.search)

    let props = {
      match: match,
      location: this.history.location,
      history:this.history,
      ui: route.ui,
      mapStateToProps: route.mapStateToProps,
      errors: this.props.errors,
      api: []
    }

    for (let i in route.api) {
      if (route.api[i]) {
        let api = () => route.api[i](this.utils, match)
        props.api.push(api)
      }
    }

    props.match.params = {...match.params, ...query}

    return props
  }

  checkErrors() {
    let errors = this.utils.getState('dashboard').errors
    let location = this.props.history.location.pathname

    for (var i in errors) {
      var e = errors[i]
      if (e.status == 403 & e.path == location) {
        this.error = {
          index: i,
          thrown: false,
          status: 'forbidden',
          route: e.route,
          path: e.path,
          content: <MainRoutes.Content.AccessDenied />,
          stateTitle: <MainRoutes.StateTitle.AccessDenied />,
        }
      } else if (e.status == 500 && e.path == location) {
        this.error = {
          index: i,
          thrown: false,
          status: 'error',
          route: e.route,
          path: e.path,
          content: <MainRoutes.Content.ServerError />,
          stateTitle: <MainRoutes.StateTitle.ServerError />,
        }
      }
    }

    if (this.error) {
      return {
        appNav: <div />,
        isSearch: false,
        search: <span />,
        content: this.error.content,
        stateTitle: this.error.stateTitle,
        location: this.props.location,
        history: this.props.history,
      }
    }
  }

  async setupRoutes(routes, parent = undefined) {
    let layout = {}

    for (let index in routes) {
      let routeModule = routes[index]
      if (typeof routes[index] === "function") {
        let module = await routes[index]()
        routeModule = module.default
      }

      let route = routeModule.route
      let ui = routeModule.ui

      if (routeModule.api) {
        let api = (utils, match) => routeModule.api(utils, match, route)

        if (parent && parent.defaultApi) {
          route.api = [parent.defaultApi, api]
        } else {
          route.api = [api]

          if (routeModule.defaultApi) {
            let api = routeModule.defaultApi
            route.defaultApi = (utils, match) => api(utils, match, route)
            route.api.push(route.defaultApi)
          }
        }
      } else {
        if (parent && parent.defaultApi) {
          route.api = [parent.defaultApi]
        } else {
          route.api = []
        }
      }

      let match = {
        path: route.path,
        exact: false,
      }

      if (route.exact) {
        match.exact = route.exact
      }

      if (route.path != undefined) {
        if (parent != undefined) {
          match.path = parent.path + route.path
        } else {
          match.path = route.path
        }
      }

      route.path = match.path
      layout[match.path] = {
        ui: ui,
        match: match,
        mapStateToProps: routeModule.mapStateToProps,
        api: route.api,
      }

      if (routeModule.reducer) {
        this.utils.updateReducer(routeModule.reducer)
      }

      if (route.children != undefined) {
        let children = this.setupRoutes(route.children, route)
        layout = Object.assign({}, layout, children)
      }
    }

    return layout
  }

  render() {
    return (
      <AppContainer
        location={ this.state.location }
        layout={ this.state.layout }
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    errors: state.dashboard.errors,
  }
}

let container = connect(mapStateToProps)(Router)

export default container
