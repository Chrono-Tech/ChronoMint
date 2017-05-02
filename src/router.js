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
import WalletPage from './pages/WalletPage'
import ExchangePage from './pages/ExchangePage'
import RewardsPage from './pages/RewardsPage'
import SettingsPage from './pages/SettingsPage'
import NoticesPage from './pages/NoticesPage'
import ProfilePage from './pages/ProfilePage'
import App from './layouts/App'
import Auth from './layouts/Auth'
import Login from './pages/LoginPage'
import { updateTIMEDeposit, updateTIMEBalance } from './redux/wallet/actions'
import { getRates } from './redux/exchange/data'
import { showAlertModal } from './redux/ui/modal'
import { login } from './redux/session/actions'
import LS from './dao/LocalStorageDAO'

const requireAuth = (nextState, replace) => {
  const isCBE = /^\/cbe/.test(nextState.location.pathname)
  const account = LS.getAccount()
  const providerId = LS.getWeb3Provider()

  if (!account || !providerId) {
    return replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    })
  } else {
    store.dispatch(login(account, false, isCBE))
  }
}

const requireDepositTIME = (nextState) => {
  const account = LS.getAccount()
  store.dispatch(updateTIMEDeposit(account)).then(() => {
    store.dispatch(updateTIMEBalance(account)).then(() => {
      if (!store.getState().get('wallet').time.deposit && nextState.location.pathname !== '/profile') {
        store.dispatch(showAlertModal({
          title: 'Error',
          message: 'Deposit TIME on Profile page if you want get access to Voting and Rewards',
          then: () => store.dispatch(push('/profile'))
        }))
      }
    })
  })
}

const router = (
  <Provider store={store}>
    <Router history={history}>
      <Redirect from='/' to='wallet' />
      <Route path='/' component={App} onEnter={requireAuth}>
        <Route path='cbe'>
          <IndexRoute component={DashboardPage} />
          <Route path='locs' component={LOCsPage} />
          <Route path='lh_story' component={LHStoryPage} />
          <Route path='operations' component={OperationsPage} />
          <Route path='settings' component={SettingsPage} />
        </Route>
        <Route path='notices' component={NoticesPage} />
        <Route path='profile' component={ProfilePage} onEnter={requireDepositTIME} />
        <Route path='voting' component={VotingPage} onEnter={requireDepositTIME} />
        <Route path='rewards' component={RewardsPage} onEnter={requireDepositTIME} />
        <Route path='wallet'>
          <IndexRoute component={WalletPage} />
          <Route path='exchange'
            component={ExchangePage}
            onEnter={() => store.dispatch(getRates())} /> // TODO move out this dispatch
        </Route>
      </Route>
      <Route component={Auth}>
        <Route path='login' component={Login} />
      </Route>
      <Route path='*' component={NotFoundPage} />
    </Router>
  </Provider>
)

export default router
