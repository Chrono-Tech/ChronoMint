/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Markup from 'layouts/Markup'
import { Provider } from 'react-redux'
import React from 'react'
import { Route, Router, IndexRoute, Redirect } from 'react-router'
import { PersistGate } from 'redux-persist/integration/react'
import {
  NotFoundPage,
  LoginForm,
  CreateHWAccount,
  LoginWithOptions,
  LoginWithTrezor,
  LoginWithLedger,
  LoginWithPlugin,
} from '@chronobank/login-ui/components'
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
import RecoverAccountPage from 'components/login/RecoverAccountPage/RecoverAccountPage'
import AccountSelectorPage from 'components/login/AccountSelectorPage/AccountSelectorPage'
import CreateAccountPage from 'components/login/CreateAccountPage/CreateAccountPage'
import { store, history } from './redux/configureStore'
import './styles/themes/default.scss'

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
    <PersistGate loading={null} persistor={store.__persistor}>
      <Router history={history} onUpdate={hashLinkScroll}>
        <Redirect from='/' to='/login' />
        <Route component={Markup}>
          <Route path='2fa' component={TwoFAPage} />
          <Route path='wallets' component={WalletsPage} />
          <Route path='wallet' component={WalletPage} />
          <Route path='add-wallet' component={AddWalletPage} />
          <Route path='deposits' component={DepositsPage} />
          <Route path='deposit' component={DepositPage} />
          <Route path='rewards' component={RewardsPage} />
          <Route path='voting' component={VotingPage} />
          <Route path='poll' component={PollPage} />
          <Route path='new-poll' component={NewPollPage} />
          <Route path='vote-history' component={VoteHistoryPage} />
          <Route path='assets' component={AssetsPage} />
        </Route>

        <Route path='/login' component={Splash}>
          <IndexRoute component={LoginForm} />
          <Route path='/login/create-account' component={CreateAccountPage} />
          <Route path='/login/select-account' component={AccountSelectorPage} />
          <Route path='/login/recover-account' component={RecoverAccountPage} />
          <Route path='/login/import-methods' component={LoginWithOptions} />
          <Route path='/login/upload-wallet' component={WalletImportPage} />
          <Route path='/login/trezor-login' component={LoginWithTrezor} />
          <Route path='/login/ledger-login' component={LoginWithLedger} />
          <Route path='/login/plugin-login' component={LoginWithPlugin} />
          <Route path='/login/mnemonic-login' component={MnemonicImportPage} />
          <Route path='/login/private-key-login' component={PrivateKeyImportPage} />
          <Route path='/login/create-hw-account' component={CreateHWAccount} />
        </Route>

        <Route path='*' component={Splash}>
          <IndexRoute component={NotFoundPage} />
        </Route>
      </Router>
    </PersistGate>
  </Provider>
)

export default router
