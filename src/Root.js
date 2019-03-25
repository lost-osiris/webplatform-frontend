import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import Waves from 'node-waves'

import History from '~/components/Core/History'
import Router from '~/components/Core/Router'

import Utils from '~/utils'

import '../assets/scss/app.scss'
import '../assets/less/vendors/font-awesome/font-awesome.less'
import '../assets/less/vendors/material-design-iconic-font/material-design-iconic-font.css'
import '../assets/less/inc/progress-bar.less'
import '../assets/less/inc/vendor-overrides/bootstrap-grid.less'
import '../assets/less/inc/autocomplete.less'


const history = History.setHistory()
const utils = new Utils()


const store = utils.getStore()

Waves.attach('.btn', ['.waves-effect'])
Waves.init()

const App = () => {
  return (
    <Provider store={ store }>
      <Router history={ history } />
    </Provider>
  )
}

const rootE = document.querySelector('react')

ReactDOM.render(
  <App />,
  rootE
)
