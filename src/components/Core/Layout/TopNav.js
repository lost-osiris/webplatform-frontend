import React, { Component } from 'react'
import { connect } from 'react-redux'

import Utils from '~/utils'
import { Link } from '~/components'

class TopNav extends Component {
  constructor(props) {
    super(props)
    this.searchStyle = {
      display: 'none',
    }
    this.className = 'header'

    this.reducer = 'dashboard'
    this.utils = new Utils(this.reducer)
    this.sideNavToggleClass = 'navigation-trigger hidden-xl-up'
    this.search = props.search
  }

  toggleSearch(event) {
    event.preventDefault()

    this.utils.dispatch('TOGGLE_SEARCH')
  }

  back(event) {
    event.preventDefault()
    this.utils.goBack()
  }

  toggleSideNav(event) {
    event.preventDefault()

    this.utils.dispatch('TOGGLE_SIDENAV')
  }

  componentDidUpdate(nextProps) {
    let stateObj = this.utils.getState()

    if (!nextProps.isSearch) {
      this.searchStyle = {
        display: 'none'
      }
    } else {
      this.search = nextProps.search
      this.searchStyle = {
        display: 'block'
      }
    }

    if (stateObj.searchToggled && nextProps.isSearch) {
      this.className += ' search-toggled'
    } else {
      this.className = 'header'
    }
  }

  render() {
    let sideNavToggleClass = 'navigation-trigger hidden-xl-up'
    let searchToggleClass = 'header'

    if (this.props.sideNavToggled) {
      sideNavToggleClass += ' toggled'
    }

    return (
      <header id="header" className={ searchToggleClass }>
        <div
          className={ sideNavToggleClass }
          // onBlur={ (e) => this.toggleSideNav(e) }
          onClick={ (e) => this.toggleSideNav(e) }
          // tabIndex={0}
        >
          <div className="navigation-trigger__inner">
            <i className="navigation-trigger__line" />
            <i className="navigation-trigger__line" />
            <i className="navigation-trigger__line" />
          </div>
        </div>
        <div className="header__logo">
          <h1>
            <Link to='/'>CEE-Tools</Link>
          </h1>
        </div>
        { this.props.search }
        <ul className="top-nav">
          <li className="hidden-xl-up">
            <a onClick={(e) => this.toggleSearch(e)}>
              <i className="zmdi zmdi-search"></i>
            </a>
          </li>
          <li className="dropdown">
            <a onClick={ (e) => this.back(e) }>
              <i className="him-icon zmdi zmdi-arrow-back"></i>
            </a>
          </li>
        </ul>
      </header>
    )
  }
}

class TopNavSearch extends Component {
  constructor(props) {
    super(props)
    this.reducer = 'dashboard'
    this.utils = new Utils(this.reducer)

    this.state = {
      focused: false,
    }
  }

  onChange(event) {
    let text = event.target.value

    if (this.props.onChange) {
      this.props.onChange(text)
    }

    this.setState({text: text})
  }

  onSubmit(event) {
    event.preventDefault()

    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.text)
    }

  }

  focusSearch() {
    this.setState({focused: !this.state.focused})
  }

  back() {
    this.utils.dispatch('TOGGLE_SEARCH')
  }

  render() {
    let { searchToggled, placeholder, onSubmit } = {...this.props}
    let inputProps = {
      placeholder: placeholder,
      onSubmit: onSubmit,
    }

    placeholder = placeholder ||'Search...'
    inputProps.placeholder = placeholder

    inputProps.onChange = (e) => this.onChange(e)
    inputProps.onClick = () => this.focusSearch()
    inputProps.onBlur = () => this.focusSearch()
    // inputProps.onFocus = () => this.focusSearch()

    inputProps.type = 'text'
    inputProps.className = 'search__text'

    let searchToggleClass = 'search'

    if (this.state.focused) {
      searchToggleClass += ' search--focus'
    }

    if (searchToggled) {
      searchToggleClass += ' search--toggled'
    }

    let formProps = {
      className: searchToggleClass,
      onSubmit: (e) => this.onSubmit(e)
    }

    return (
      <form {...formProps}>
        <div className="search__inner">
          <input {...inputProps} />
          <i className="search__helper zmdi zmdi-search" onClick={() => this.back()}></i>
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    searchToggled: state.dashboard.searchToggled,
  }
}

const container = connect(mapStateToProps)(TopNavSearch)

export {
  container as TopNavSearch,
  TopNav
}
