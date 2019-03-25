import Jobs from '~/modules/JobRunner/modules/Job/containers/JobContainer'
import * as StateTitle from '../StateTitle'
import * as Nav from '../Nav'

var route = {
  route: {
    path: '/job/:id',
    component: Jobs,
  },
  ui: {
    stateTitle: StateTitle.Job,
    appNav: Nav.Main,
  },
  mapStateToProps: {
    stateTitle: state => ({
      job: state.jobrunner.job,
    })
  },
}

export default route
