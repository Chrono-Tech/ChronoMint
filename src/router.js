/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Markup from 'layouts/Markup'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router/immutable'
import { Route, Switch, Redirect, IndexRoute } from 'react-router'
import React from 'react'
import LoginForm from '@chronobank/login-ui/components/LoginForm/LoginForm'
import NotFoundPage from '@chronobank/login-ui/components/NotFoundPage/NotFoundPage'
import LoginWithOptions from '@chronobank/login-ui/components/LoginWithOptions/LoginWithOptions'
import Splash from 'layouts/Splash/Splash'
import {
  AssetsPage,
  RewardsPage,
  VotingPage,
  PollPage,
  WalletsPage,
  WalletPage,
  DepositsPage,
  DepositPage,
  AddWalletPage,
  TwoFAPage,
  NewPollPage,
  VoteHistoryPage,
} from 'pages/lib'
import MnemonicImportPage from 'components/login/MnemonicImportPage/MnemonicImportPage'
import PrivateKeyImportPage from 'components/login/PrivateKeyImportPage/PrivateKeyImportPage'
import WalletImportPage from 'components/login/WalletImportPage/WalletImportPage'
import TrezorLoginPage from 'components/login/TrezorLoginPage/TrezorLoginPage'
import LedgerLoginPage from 'components/login/LedgerLoginPage/LedgerLoginPage'
import MetamaskLoginPage from 'components/login/MetamaskLoginPage/MetamaskLoginPage'
import RecoverAccountPage from 'components/login/RecoverAccountPage/RecoverAccountPage'
import AccountSelectorPage from 'components/login/AccountSelectorPage/AccountSelectorPage'
import CreateAccountPage from 'components/login/CreateAccountPage/CreateAccountPage'
import localStorage from 'utils/LocalStorage'
import './styles/themes/default.scss'

// const requireAuth = (nextState, replace) => {
//   if (!localStorage.isSession()) {
//     // pass here only for Test RPC session.
//     // Others through handle clicks on loginPage
//     return replace({
//       pathname: '/',
//       state: { nextPathname: nextState.location.pathname },
//     })
//   }
// }

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

const isAuthenticated = ({ component: Component }) => (props) =>
  localStorage.isSession()
    ? <Component {...props} />
    : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={isAuthenticated(Component)}
  />
)

const renderWithMarkup = (Component) => (props) => (
  <Markup {...props}>
    <Component {...props} />
  </Markup>
)

const renderWithSplash = (Component) => (props) => (
  <Splash {...props}>
    <Component {...props} />
  </Splash>
)

const router = (store, history) => (
  <Provider store={store}>
    <ConnectedRouter history={history} onUpdate={hashLinkScroll}>
      <Switch>
        <Redirect exact from='/' to='/login' />
        <PrivateRoute path='2fa' render={renderWithMarkup(TwoFAPage)} />
        <PrivateRoute path='wallets' render={renderWithMarkup(WalletsPage)}/>
        <PrivateRoute path='wallet' render={renderWithMarkup(WalletPage)} />
        <PrivateRoute path='add-wallet' render={renderWithMarkup(AddWalletPage)} />
        <PrivateRoute path='deposits' render={renderWithMarkup(DepositsPage)} />
        <PrivateRoute path='deposit' render={renderWithMarkup(DepositPage)} />
        <PrivateRoute path='rewards' render={renderWithMarkup(RewardsPage)} />
        <PrivateRoute path='voting' render={renderWithMarkup(VotingPage)} />
        <PrivateRoute path='poll' render={renderWithMarkup(PollPage)} />
        <PrivateRoute path='new-poll'render={renderWithMarkup(NewPollPage)} />
        <PrivateRoute path='vote-history' render={renderWithMarkup(VoteHistoryPage)} />
        <PrivateRoute path='assets' render={renderWithMarkup(AssetsPage)} />
        <Route path='/login' render={renderWithSplash(LoginForm)} />
        <Route path='/login/create-account' render={renderWithSplash(CreateAccountPage)} />
        <Route path='/login/select-account' render={renderWithSplash(AccountSelectorPage)} />
        <Route path='/login/recover-account' render={renderWithSplash(RecoverAccountPage)} />
        <Route path='/login/import-methods' render={renderWithSplash(LoginWithOptions)} />
        <Route path='/login/upload-wallet' render={renderWithSplash(WalletImportPage)} />
        <Route path='/login/trezor-login' render={renderWithSplash(TrezorLoginPage)} />
        <Route path='/login/ledger-login' render={renderWithSplash(LedgerLoginPage)} />
        <Route path='/login/plugin-login' render={renderWithSplash(MetamaskLoginPage)}/>
        <Route path='/login/mnemonic-login' render={renderWithSplash(MnemonicImportPage)}/>
        <Route path='/login/private-key-login' render={renderWithSplash(PrivateKeyImportPage)}/>
        <Route component={NotFoundPage} />
      </Switch>
    </ConnectedRouter>
  </Provider>
)

export default router
