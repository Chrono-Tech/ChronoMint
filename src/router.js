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
import LOCsPage from './pages/LOCsPage'
import LHStoryPage from './pages/LHStoryPage'
import VotingPage from './pages/VotingPage'
import OperationsPage from './pages/OperationsPage'
import DashboardPage from './pages/DashboardPage'
import RewardsPage from './pages/RewardsPage'

import SettingsPage from './pages/SettingsPage'
import UserManagerPage from './pages/SettingsPage/UserManagerPage'
import ERC20ManagerPage from './pages/SettingsPage/ERC20ManagerPage'

import NoticesPage from './pages/NoticesPage'
import ProfilePage from './pages/ProfilePage'
import App from './layouts/App'
import Auth from './layouts/Auth'
import Login from './pages/LoginPage/LoginPage'
import { updateTIMEDeposit } from './redux/wallet/actions'
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

const requireDepositTIME = async (nextState) => {
  await store.dispatch(updateTIMEDeposit(ls.getAccount()))
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
    <Router history={history}>
      <Redirect from='/' to='/new/wallet'/>
      <Route path='/' component={App} onEnter={requireAuth}>
        <Route path='cbe'>
          <IndexRoute component={DashboardPage}/>
          <Route path='locs' component={LOCsPage}/>
          <Route path='lh_story' component={LHStoryPage}/>
          <Route path='operations' component={OperationsPage}/>
          <Route path='settings'>
            <IndexRoute component={SettingsPage}/>
            <Route path='user' component={UserManagerPage}/>
            <Route path='erc20' component={ERC20ManagerPage}/>
          </Route>
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
      </Route>
      <Route path='markup' component={Markup} onEnter={requireAuth}>
        <Route path='dashboard' component={Pages.DashboardPage} />
        <Route path='exchange' component={Pages.ExchangePage} />
        <Route path='rewards' component={Pages.RewardsPage} />
      </Route>
      <Route path='*' component={NotFoundPage}/>
    </Router>
  </Provider>
)

export default router
