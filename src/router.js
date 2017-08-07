import React from 'react'
import {
  Route,
  IndexRoute,
  Redirect,
  Router
} from 'react-router'
import { Provider } from 'react-redux'
import { push } from 'react-router-redux'
import { store, history } from './redux/configureStore'
import NotFoundPage from './pages/NotFoundPage.js'
import LHStoryPage from './pages/LHStoryPage'
import VotingPage from './pages/VotingPage'
import DashboardPage from './pages/DashboardPage'
import RewardsPage from './pages/RewardsPage'

import NoticesPage from './pages/NoticesPage'
import ProfilePage from './pages/ProfilePage'
import App from './layouts/App'
import Auth from './layouts/Auth'
import Login from './pages/LoginPage/LoginPage'
import { initTIMEDeposit } from './redux/wallet/actions'
import { showAlertModal } from './redux/ui/modal'
import ls from './utils/LocalStorage'

import { Markup } from './layouts'
import Pages from './pages/lib'

import './styles/themes/default.scss'

const requireAuth = (nextState, replace) => {
  if (!ls.isSession()) {
    // pass here only for Test RPC session.
    // Others through handle clicks on loginPage
    return replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
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

const requireDepositTIME = async (nextState) => {
  await store.dispatch(initTIMEDeposit())
  if (!store.getState().get('wallet').timeDeposit && nextState.location.pathname !== '/profile') {
    store.dispatch(showAlertModal({
      title: 'Error',
      message: 'Deposit TIME on Profile page if you want get access to Voting and Rewards',
      then: () => store.dispatch(push('/new/wallet'))
    }))
  }
}

const router = (
  <Provider store={store}>
    <Router history={history} onUpdate={hashLinkScroll}>
      <Redirect from='/' to='/new/wallet'/>
      <Redirect from='/cbe' to='/cbe/settings'/>
      <Route path='/' component={App} onEnter={requireAuth}>
        <Route path='cbe'>
          <IndexRoute component={DashboardPage}/>
          <Route path='lh_story' component={LHStoryPage}/>
        </Route>
        <Route path='notices' component={NoticesPage}/>
        <Route path='profile' component={ProfilePage} onEnter={requireDepositTIME}/>
        <Route path='voting' component={VotingPage} onEnter={requireDepositTIME}/>
        <Route path='rewards' component={RewardsPage} onEnter={requireDepositTIME}/>
      </Route>
      <Route component={Auth}>
        <Route path='login' component={Login}/>
      </Route>
      <Route path='new' component={Markup} onEnter={requireAuth}>
        <Route path='wallet' component={Pages.WalletPage} />
        <Route path='dashboard' component={Pages.DashboardPage} />
        <Route path='exchange' component={Pages.ExchangePage} />
        <Route path='rewards' component={Pages.RewardsPage} />
        <Route path='voting' component={Pages.VotingPage} />
        <Route path='cbe'>
          <Route path='locs' component={Pages.LOCPage} />
          <Route path='operations' component={Pages.OperationsPage}/>
          <Route path='settings' component={Pages.SettingsPage}/>
        </Route>
      </Route>
      <Route path='*' component={NotFoundPage}/>
    </Router>
  </Provider>
)

export default router
