import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import staticReducers  from '~/reducers'
import History from '~/components/Core/History'

let store
var history = History.getHistory()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

function createReducer(asyncReducers) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers
  })
}

// Configure the store
function configureStore() {
  const store = createStore(
    createReducer(),
    composeEnhancers(
      applyMiddleware(thunk)
    )
  )

  // Add a dictionary to keep track of the registered async reducers
  store.asyncReducers = {}

  // Create an inject reducer function
  // This function adds the async reducer, and creates a new combined reducer
  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer
    store.replaceReducer(createReducer(store.asyncReducers))
  }

  // Return the modified store
  return store
}

store = configureStore()

export default store
