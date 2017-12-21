import Markup from 'layouts/Markup'
import { Provider } from 'react-redux'
import React from 'react'
import { Route, Router } from 'react-router'
import NotFoundPage from 'pages/NotFound/NotFound'
import LoginPage from 'pages/LoginPage/LoginPage'
import Splash from 'layouts/Splash/Splash'
import {
  AssetsPage,
  DashboardPage,
  ExchangePage,
  LOCPage,
  OperationsPage,
  RewardsPage,
  SettingsPage,
  VotingPage,
  WalletPage,
} from 'pages/lib'
import { store, history } from './redux/configureStore'
import './styles/themes/default.scss'

const requireAuth = (store) => (nextState, replace) => {
  const session = store.getState().get('session')
  // pass here only for Test RPC session.
  if (!session.isSession) {
    // Others through handle clicks on loginPage
    return replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname },
    })
  }
}

function hashLinkScroll () {
  const { hash } = window.location
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
      <Route component={Markup} onEnter={requireAuth(store)}>
        <Route path='wallet' component={WalletPage} />
        <Route path='dashboard' component={DashboardPage} />
        <Route path='exchange' component={ExchangePage} />
        <Route path='rewards' component={RewardsPage} />
        <Route path='voting' component={VotingPage} />
        <Route path='assets' component={AssetsPage} />
        <Route path='cbe'>
          <Route path='locs' component={LOCPage} />
          <Route path='operations' component={OperationsPage} />
          <Route path='settings' component={SettingsPage} />
        </Route>
      </Route>

      <Route component={Splash}>
        <Route path='/' component={LoginPage} />
        <Route path='*' component={NotFoundPage} />
      </Route>
    </Router>
  </Provider>
)

export default router
