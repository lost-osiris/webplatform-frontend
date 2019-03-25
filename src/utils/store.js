import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer  from '~/reducers'
import History from '~/components/Core/History'
import { connectRouter, routerMiddleware } from 'connected-react-router'

let store
var history = History.getHistory()
var reactRouter = routerMiddleware(history)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

let middleware = composeEnhancers(
  applyMiddleware(thunk),
  applyMiddleware(reactRouter),
)

store = createStore(connectRouter(history)(rootReducer), middleware)

export default store
