export default function AdminSettingsReducer(state = {}, action) {
  switch (action.type) {
    case 'SETTINGS_TEMPLATES_INIT': {
      const templates = action.data
      return Object.assign({}, state, {
        templates: templates
      })
    }
    case 'SETTINGS_TEMPLATE': {
      const template = action.data
      return Object.assign({}, state, {
        template: template 
      })
    }
    case 'SETTINGS_ADD': {
      let applications = action.data 

      return Object.assign({}, state, {
        applications: applications
      })
    }
    default:
      return state
  }
}