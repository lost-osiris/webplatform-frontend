import { createBrowserHistory } from 'history'

let history

const getHistory = () => {
  if (!history) {
    return setHistory()
  }

  return history
}

const setHistory = () => {
  if (history) {
    return getHistory()
  }

  history = createBrowserHistory()

  return history
}

const push = (url) => {
  history.push(url)
}

const goBack = () => {
  history.goBack()
}

const goForward = () => {
  history.goForward()
}

const go = (url) => {
  history.go(url)
}

const getLocation = () => {
  return history.location
}


export default {
  setHistory: setHistory,
  getHistory: getHistory,
  getLocation: getLocation,
  push: push,
  goBack: goBack,
  goForward: goForward,
  go: go,
}
