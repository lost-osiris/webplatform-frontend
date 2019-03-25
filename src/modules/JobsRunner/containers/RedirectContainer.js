import React, { Component } from 'react'
import Utils from '~/utils'
import { Loading } from '~/components'

// import Main from './MainContainer'
// import Add from '../modules/Add/containers/AddContainer'
// import Edit from '../modules/Edit/containers/EditContainer'
// import Jobs from '../modules/Job/containers/JobContainer'

export default class RedirectContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()
  }

  UNSAFE_componentWillMount() {
    this.redirect(this.props)
  }

  UNSAFE_componentWillUpdate() {
    this.redirect(this.props)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.redirect(nextProps)
  }

  redirect(props) {
    if (props.match.params.status == undefined && props.location.pathname === '/jobs') {
      var uid = this.utils.getUser().uid
      this.utils.push(`/jobs/user/${ uid }/all/false`)
    }
  }

  componentWillUnmount() {
  }

  render() {
    return (
      this.props.children != null
        ? <div>{ this.props.children }</div>
        :
        <Loading />
    )
  }
}
