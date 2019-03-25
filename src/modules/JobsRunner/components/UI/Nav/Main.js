import React, { Component } from 'react'
import { Link } from '~/components'
import Utils from '~/utils'

class JobRunnerAppNav extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()
    this.uid = this.utils.getUser().uid
  }

  render() {
    return (
      <div>
        <ul className="main-menu">
          <li className="nav-header">
            <span>
              <Link to='/jobs'>Jobs</Link>
            </span>
          </li>
        </ul>
      </div>
    )
  }
}

export default JobRunnerAppNav
