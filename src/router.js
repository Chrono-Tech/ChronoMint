/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Markup from 'layouts/Markup'
import React from 'react'
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom'
// import { BrowserRouter } from 'react-router-dom'
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

const requireAuth = (nextState, replace) => {
  if (!localStorage.isSession()) {
    // pass here only for Test RPC session.
    // Others through handle clicks on loginPage
    return replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname },
    })
  }
}

const LoginRoutes = (props) => {
  const { match } = props
  return (
    <Splash {...props}>
      <Switch>
        <Route exact path={match.url}>
          <LoginForm {...props} />
        </Route>
        <Route exact path={match.url + '/create-account'}>
          <CreateAccountPage {...props} />
        </Route>
        <Route exact path={match.url + '/select-account'}>
          <AccountSelectorPage {...props} />
        </Route>
        <Route exact path={match.url + '/recover-account'}>
          <RecoverAccountPage {...props} />
        </Route>
        <Route exact path={match.url + '/import-methods'}>
          <LoginWithOptions {...props} />
        </Route>
        <Route exact path={match.url + '/upload-wallet'}>
          <WalletImportPage {...props} />
        </Route>
        <Route exact path={match.url + '/trezor-login'}>
          <TrezorLoginPage {...props} />
        </Route>
        <Route exact path={match.url + '/ledger-login'}>
          <LedgerLoginPage {...props} />
        </Route>
        <Route exact path={match.url + '/plugin-login'}>
          <MetamaskLoginPage {...props} />
        </Route>
        <Route exact path={match.url + '/mnemonic-login'}>
          <MnemonicImportPage {...props} />
        </Route>
        <Route exact path={match.url + '/private-key-login'}>
          <PrivateKeyImportPage {...props} />
        </Route>
      </Switch>
    </Splash>
  )
}

const WalletsRoutes = (props) => (
  <Markup {...props}>
    <Switch>
      <Route exact path='2fa'>
        <TwoFAPage {...props} />
      </Route>
      <Route exact path='wallets'>
        <WalletsPage {...props} />
      </Route>
      <Route exact path='wallet'>
        <WalletPage {...props} />
      </Route>
      <Route exact path='add-wallet'>
        <AddWalletPage {...props} />
      </Route>
      <Route exact path='deposits'>
        <DepositsPage {...props} />
      </Route>
      <Route exact path='deposit'>
        <DepositPage {...props} />
      </Route>
      <Route exact path='rewards'>
        <RewardsPage {...props} />
      </Route>
      <Route exact path='voting'>
        <VotingPage {...props} />
      </Route>
      <Route exact path='poll'>
        <PollPage {...props} />
      </Route>
      <Route exact path='new-poll'>
        <NewPollPage {...props} />
      </Route>
      <Route exact path='vote-history'>
        <VoteHistoryPage {...props} />
      </Route>
      <Route exact path='assets'>
        <AssetsPage {...props} />
      </Route>
    </Switch>
  </Markup>
)

// 404
const NotFound = (props) => (
  <Splash {...props}>
    <NotFoundPage />
  </Splash>
)

const router = () => (
  <BrowserRouter>
    <Switch>
      <Redirect exact from='/' to='/login' />
      <Route exact path='/login' component={LoginRoutes} />
      <Route component={WalletsRoutes} onEnter={requireAuth} />
      <Route path='*' component={NotFound} />
    </Switch>
  </BrowserRouter>
)

export default router
