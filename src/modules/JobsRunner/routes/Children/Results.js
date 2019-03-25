import Results from '~/modules/JobRunner/modules/Job/containers/ResultsContainer'
import * as StateTitle from '../StateTitle'
import * as Nav from '../Nav'

var route = {
  route: {
    path: '/results/:id',
    exact: true,
    component: Results,
  },
  ui: {
    stateTitle: StateTitle.Results,
    appNav: Nav.Main,
  },
  mapStateToProps: {
    stateTitle: state => ({
      job: state.jobrunner.job,
    })
  }
}

export default route
