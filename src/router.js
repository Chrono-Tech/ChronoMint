import React from 'react'
import {
  Route,
  IndexRoute,
  Redirect,
  Router
} from 'react-router'
import {Provider} from 'react-redux'
import {store, history} from './redux/configureStore'
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
import {login} from './redux/session/actions'
import {updateTimeDeposit} from './redux/wallet/wallet'
import {getRates} from './redux/exchange/data'
import localStorageKeys from './constants/localStorageKeys'
import { setWeb3, setWeb3ProviderByName } from './redux/network/networkAction'
import Web3ProviderNames from './network/Web3ProviderNames'

const requireAuth = (nextState, replace) => {
  const account = window.localStorage.getItem(localStorageKeys.CHRONOBANK_ACCOUNT)
  const providerName = window.localStorage.getItem(localStorageKeys.CHRONOBANK_WEB3_PROVIDER)

  const canLogin = providerName === Web3ProviderNames.LOCAL ||
    providerName === Web3ProviderNames.METAMASK ||
    providerName === Web3ProviderNames.UPORT

  if (!account || !canLogin) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    })
  } else {
    store.dispatch(setWeb3(providerName))
    store.dispatch(setWeb3ProviderByName(providerName))
    store.dispatch(
      login(account, false, /^\/cbe/.test(nextState.location.pathname))
    )
  }
}

const loginExistingUser = () => {
  const account = window.localStorage.getItem(localStorageKeys.CHRONOBANK_ACCOUNT)
  const providerName = window.localStorage.getItem(localStorageKeys.CHRONOBANK_WEB3_PROVIDER)

  const canLogin = providerName === Web3ProviderNames.LOCAL ||
    providerName === Web3ProviderNames.METAMASK ||
    providerName === Web3ProviderNames.UPORT

  if (account && canLogin) {
    store.dispatch(setWeb3(providerName))
    store.dispatch(setWeb3ProviderByName(providerName))
    store.dispatch(login(account))
  }
}

const requireDepositTIME = (nextState, replace) => {
  store.dispatch(updateTimeDeposit(window.localStorage.getItem('chronoBankAccount'))).then(() => {
    if (!store.getState().get('wallet').time.deposit && nextState.location.pathname !== '/profile') {
      replace({
        pathname: '/profile',
        state: {nextPathname: nextState.location.pathname}
      })
    }
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
            onEnter={() => store.dispatch(getRates())} />
        </Route>
      </Route>
      <Route component={Auth}>
        <Route path='login' component={Login} onEnter={loginExistingUser} />
      </Route>
      <Route path='*' component={NotFoundPage} />
    </Router>
  </Provider>
)

export default router
