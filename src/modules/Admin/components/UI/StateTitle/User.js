import React from 'react'
import Utils from '~/utils'

export default class UserStateTitle extends React.Component {
  constructor(props) {
    super(props)

    this.utils = new Utils()
  }

  render() {
    let user = this.utils.getUser()

    return <h3>Currently logged in as { user.uid }</h3>
  }
}
