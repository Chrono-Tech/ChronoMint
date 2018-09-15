/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Markup from 'layouts/Markup'
// import { Provider } from 'react-redux'
// import { ConnectedRouter } from 'connected-react-router/immutable'
// import { PersistGate } from 'redux-persist/lib/integration/react'
import { Route, Switch, Redirect } from 'react-router'
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

// const isAuthenticated = ({ component: Component }) => (props) =>
//   localStorage.isSession()
//     ? <Component {...props} />
//     : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />

const PrivateRoute = ({ component: Component, isLoggedIn, props: cProps, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn
        ? (<Component {...props} {...cProps} />)
        : (<Redirect to='/login' />)
    }
  />
)

const renderWithMarkup = (Component) => (props) => {
  console.log('MARKUP C:', props)
  return (
    <Markup {...props}>
      <Component {...props} />
    </Markup>
  )
}

const renderWithSplash = (Component) => (props) => {
  console.log('SPLASH C:', props)
  return (
    <Splash {...props}>
      <Component {...props} />
    </Splash>
  )
}

const router = (store) => {
  const state = store.getState()
  const session = state.get('session')
  return (
    <Switch>
      <Redirect exact from='/' to='/login' />
      <PrivateRoute isLoggedIn={session.isSession} path='2fa' render={renderWithMarkup(TwoFAPage)} />
      <PrivateRoute isLoggedIn={session.isSession} path='wallets' render={renderWithMarkup(WalletsPage)} />
      <PrivateRoute isLoggedIn={session.isSession} path='wallet' render={renderWithMarkup(WalletPage)} />
      <PrivateRoute isLoggedIn={session.isSession} path='add-wallet' render={renderWithMarkup(AddWalletPage)} />
      <PrivateRoute isLoggedIn={session.isSession} path='deposits' render={renderWithMarkup(DepositsPage)} />
      <PrivateRoute isLoggedIn={session.isSession} path='deposit' render={renderWithMarkup(DepositPage)} />
      <PrivateRoute isLoggedIn={session.isSession} path='rewards' render={renderWithMarkup(RewardsPage)} />
      <PrivateRoute isLoggedIn={session.isSession} path='voting' render={renderWithMarkup(VotingPage)} />
      <PrivateRoute isLoggedIn={session.isSession} path='poll' render={renderWithMarkup(PollPage)} />
      <PrivateRoute isLoggedIn={session.isSession} path='new-poll' render={renderWithMarkup(NewPollPage)} />
      <PrivateRoute isLoggedIn={session.isSession} path='vote-history' render={renderWithMarkup(VoteHistoryPage)} />
      <PrivateRoute isLoggedIn={session.isSession} path='assets' render={renderWithMarkup(AssetsPage)} />
      <Route path='/login' render={(props) => <Splash {...props}><LoginForm {...props} /></Splash>} />
      <Route path='/login/create-account' render={(props) => <Splash {...props}><CreateAccountPage {...props} /></Splash>} />
      <Route path='/login/select-account' render={(props) => <Splash {...props}><AccountSelectorPage {...props} /></Splash>} />
      <Route path='/login/recover-account' render={renderWithSplash(RecoverAccountPage)} />
      <Route path='/login/import-methods' render={renderWithSplash(LoginWithOptions)} />
      <Route path='/login/upload-wallet' render={renderWithSplash(WalletImportPage)} />
      <Route path='/login/trezor-login' render={renderWithSplash(TrezorLoginPage)} />
      <Route path='/login/ledger-login' render={renderWithSplash(LedgerLoginPage)} />
      <Route path='/login/plugin-login' render={renderWithSplash(MetamaskLoginPage)} />
      <Route path='/login/mnemonic-login' render={renderWithSplash(MnemonicImportPage)} />
      <Route path='/login/private-key-login' render={renderWithSplash(PrivateKeyImportPage)} />
      <Route component={NotFoundPage} />
    </Switch>
  )
}

export default router
