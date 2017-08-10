import React from 'react'
import { Route, Router } from 'react-router'
import { Provider } from 'react-redux'
import { store, history } from './redux/configureStore'
import NotFoundPage from './pages/NotFoundPage.js'
import Login from './pages/LoginPage/LoginPage'
import ls from './utils/LocalStorage'

import Markup from './layouts/Markup'
import Pages from './pages/lib'

import './styles/themes/default.scss'

const requireAuth = (nextState, replace) => {
  if (!ls.isSession()) {
    // pass here only for Test RPC session.
    // Others through handle clicks on loginPage
    return replace({
      pathname: '/',
      state: {nextPathname: nextState.location.pathname}
    })
  }
}

function hashLinkScroll () {
  const {hash} = window.location
  if (hash !== '') {
    setTimeout(() => {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) element.scrollIntoView()
    }, 0)
  }
}

const router = (
  <Provider store={store}>
    <Router history={history} onUpdate={hashLinkScroll}>
      <Route component={Markup} onEnter={requireAuth}>
        <Route path='wallet' component={Pages.WalletPage} />
        <Route path='dashboard' component={Pages.DashboardPage} />
        <Route path='exchange' component={Pages.ExchangePage} />
        <Route path='rewards' component={Pages.RewardsPage} />
        <Route path='voting' component={Pages.VotingPage} />
        <Route path='cbe'>
          <Route path='locs' component={Pages.LOCPage} />
          <Route path='operations' component={Pages.OperationsPage} />
          <Route path='settings' component={Pages.SettingsPage} />
        </Route>
      </Route>

      <Route path='/' component={Login} />
      <Route path='*' component={NotFoundPage} />
    </Router>
  </Provider>
)

export default router
