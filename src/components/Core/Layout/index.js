import React, { Component } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'

import {
  Loading,
  ConnectedUI,
} from '~/components'
import Utils from '~/utils'

import SideNav from './SideNav'
import { TopNav, TopNavSearch } from './TopNav'
import ProgressBar from './ProgressBar'
import NavSubMenu from './NavSubMenu'

class Layout extends Component {
  constructor(props) {
    super(props)
    this.reducer = 'dashboard'
    this.utils = new Utils(this.reducer)

    this.state = {
      layout: {
        content: <div />,
        stateTitle: <div />,
        appNav: <div />,
        search: <div />,
        isSearch: false,
        location: props.location,
        default: true
      }
    }

  }

  componentDidUpdate() {
    if (!this.props.loadingComponents) {
      if (this.state.layout.default ||
        this.state.layout.location.key != this.props.location.key) {
        this.buildLayout(this.props)
      }
    }
  }

  buildLayout(props) {
    let layout = {
      location: props.location
    }

    let defaultProps = {
      location: props.location,
      history: props.history,
      match: props.match,
      user: this.utils.getUser(),
      mapStateToProps: props.mapStateToProps,
    }

    let keys = [
      'stateTitle',
      'content',
      'appNav',
      'search'
    ]

    for (let i in keys) {
      let k = keys[i]

      defaultProps.ui = props.ui[k]

      if (props.ui[k]) {
        layout[k] = <ConnectedUI {...defaultProps} />
      } else {
        layout[k] = <div />
      }

      if (k == 'search') {
        layout.isSearch = true
      }
    }

    this.setState({layout: layout})
  }

  toggleSideNav(event) {
    event.preventDefault()
    if (this.props.sideNavToggled) {
      this.utils.dispatch('TOGGLE_SIDENAV_OFF')
    }
  }

  render() {
    let user = this.utils.getUser()
    let sideNavClass = 'sidebar'

    if (this.props.sideNavToggled) {
      sideNavClass += ' toggled'
    } else {
      sideNavClass = 'sidebar'
    }

    let loading = this.props.loadingComponents || this.props.loadingAPI

    return (
      <main className="layout">
        <ProgressBar />
        <TopNav
          isSearch={ this.state.layout.isSearch }
          search={ this.state.layout.search }
          sideNavToggled={ this.props.sideNavToggled }
          searchToggled={ this.props.searchToggled }
        />
        <div className="main">
          <div className={ sideNavClass }>
            <Scrollbars autoHide>
              <aside className="sidebar__content">
                <SideNav
                  user={ user }
                  sideNavToggled={this.props.sideNavToggled}
                  appNav={ this.state.layout.appNav }
                  loading={ this.props.loading }
                />
              </aside>
            </Scrollbars>
          </div>
          <div
            className="main-content"
            tabIndex={0}
            onFocus={(e) => this.toggleSideNav(e)}
          >
            <Scrollbars autoHide>
              <section className="content">
                <Loading className="page-loader__app" toggle={loading} />
                <div className="animated fadeInUp">
                  <header className="content__title">
                    { this.state.layout.stateTitle }
                  </header>
                  { this.state.layout.content }
                </div>
              </section>
            </Scrollbars>
          </div>
        </div>
      </main>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sideNavToggled: state.dashboard.sideNavToggled,
    searchToggled: state.dashboard.searchToggled,
  }
}

let container = connect(mapStateToProps)(Layout)

export {
  TopNavSearch as TopNavSearch,
  container as Layout,
  NavSubMenu as NavSubMenu
}
