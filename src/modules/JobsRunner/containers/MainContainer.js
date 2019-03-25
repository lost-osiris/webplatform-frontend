import React, { Component } from 'react'
import { connect } from 'react-redux'

import Utils from '~/utils'
import { Loading } from '~/components'

import JobsMain from '../components/Main'

class JobsMainContainer extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils('jobrunner.main')
  }

  setup(self, status) {
    const statuses = [
      'all',
      'waiting',
      'queued',
      'running',
      'finished',
      'stopped',
      'failed'
    ]

    self.user = self.utils.getUser()

    if (status == undefined) {
      status = 'all'
    }

    self.uid = self.user.uid
    self.isAdmin = false

    var api = {
      path: 'jobs.scheduled.list',
      data: {
        uid: self.uid,
        status: status,
      },
    }

    if (self.utils.checkPermissions('jobs', 'admin')) {
      api.data.admin = true
      self.isAdmin = true
    }

    self.utils.request(api)
    self.loading = true
    self.utils.getData().then((data) => {
      self.loading = false

      let output = {
        all: [],
      }
      for (let i in data) {
        let job = data[i]

        if (output[job.status] == undefined) {
          output[job.status] = []
        }

        output['all'].push(job)
        output[job.status].push(job)
      }

      for (let i in statuses) {
        if (output[statuses[i]] == undefined) {
          output[statuses[i]] = []
        }
      }

      self.utils.dispatch('INIT', {data: output, status: status})
    })
  }

  componentWillMount() {
    this.setup(this)
  }

  componentWillUpdate() {
    var stateObj = this.utils.getState()
    if (!this.loading) {
      this.data = stateObj.jobs[stateObj.currentStatus]
    }

      // if (stateObj.currentStatus == undefined && stateObj.jobs != undefined) {
      //    if (stateObj.jobs['all'] != undefined) {
      //       this.data = stateObj.jobs['all'];
      //    }
      // } else {
      //    if (stateObj.jobs != undefined) {
      //    }
      // }
  }

  render() {
    if (this.data == undefined) {
      return <Loading />
    }

    let props = {
      loading: this.loading,
      status: 'all',
      data: this.data,
      fetchJobs: this.setup,
      container: this,
    }

    return <JobsMain { ...props } />
  }
}

export default connect(state => ({
  main: state.jobrunner.main,
}))(JobsMainContainer)


   // componentWillReceiveProps(nextProps) {
   //    var changeInAdmin = false;
   //    if (nextProps.match.params.isAdmin != this.isAdmin) {
   //       this.isAdmin = nextProps.match.params.isAdmin;
   //       changeInAdmin = true;
   //    }
   //    if (nextProps.match.params.status != this.status || changeInAdmin) {
   //       this.status = nextProps.match.params.status;
   //       this.uid = nextProps.match.params.uid;
   //
   //       if (this.utils.getState()[this.status] == undefined || changeInAdmin) {
   //          this.loading(true);
   //          var data = {
   //             uid: this.uid,
   //             status: this.status,
   //          };
   //
   //          if (this.isAdmin == 'true' && this.utils.getUser().permissions.is_job_admin) {
   //             data.admin = true;
   //             this.buttonGroup = this.makeButtonGroup();
   //          }
   //          else {
   //             this.buttonGroup = '';
   //          }
   //
   //          var api = {
   //             path: 'jobs.scheduled.list',
   //             data: data,
   //          };
   //
   //          this.utils.request(api);
   //
   //          this.utils.getData().then((data) => {
   //             this.utils.dispatch('INIT', {data: data, status: this.status});
   //             this.loading(false);
   //          });
   //       }
   //    }
   // }
