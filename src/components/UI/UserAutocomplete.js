import React, { Component } from 'react'
import { Inputs } from '~/components'

export default class UserAutocomplete extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: props.error
    }
  }

  handleChange(result) {
    if (this.props.onChange != undefined) {
      this.props.onChange(result)
    }

    if (this.props.error != undefined) {
      this.setState({error: this.props.error})
    } else {
      if (result.selected) {
        this.setState({error: false})
      } else {
        this.setState({error: true})
      }
    }
  }

  render() {

    return (
      <Inputs.ApiAutocomplete
        placeholder="Enter UID"
        minSearch={3}
        api={'users.search'}
        searchText={this.props.searchText}
        error={this.state.error}
        resultsComponent={Results}
        onChange={(result) => this.handleChange(result)}
      />
    )
  }
}

class Results extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <img className="pull-left autcomplete-user-img" src={this.props.picture} />
        <span>{ this.props.cn } ({ this.props.uid })</span>
      </div>
    )
  }
}
