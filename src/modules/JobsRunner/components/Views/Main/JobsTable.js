import React, { Component } from 'react'
import moment from 'moment'
import { Link, FormatDate } from '~/components'

import Utils from '~/utils'

export default class JobsTable extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('jobrunner.main')
  }

  componentWillMount() {
    this.data = this.props.jobs
  }

  componentWillReceiveProps(nextProps) {
    this.data = nextProps.jobs
  }

  render() {
    var textColor = {
      finished: 'label bgm-green',
      failed: 'label bgm-red',
      queued: 'label bgm-blue',
      waiting: 'label bgm-orange',
      running: 'label bgm-purple',
      stopped: 'label bgm-pink',
    }

    var body = this.data.map((job) => {
      var date = moment.utc(job.run_time)
      var localdate = moment(date).local()

      return (
        <tr key={ job.id }>
          <td width="25%"><span className={ textColor[job.status] }>{ job.status }</span></td>
          <td width="25%"><Link to={ `/jobs/job/${ job.id }` }>{ job.name }</Link></td>
          <td width="25%">{ job.api }</td>
          <td width="25%"><FormatDate date={localdate} /></td>
        </tr>
      )
    })

    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <td><b>Status</b></td>
            <td><b>Name</b></td>
            <td><b>Job</b></td>
            <td><b>Runtime</b></td>
          </tr>
        </thead>
        <tbody>
          { body }
        </tbody>
      </table>
    )
  }
}
