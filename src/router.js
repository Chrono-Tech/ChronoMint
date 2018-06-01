/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Markup from 'layouts/Markup'
import { Provider } from 'react-redux'
import React from 'react'
import { Route, Router } from 'react-router'
import {
  NotFoundPage,
  LoginPage,
  CreateAccountPage,
  SelectWalletPage,
  RecoverAccountPage,
  ResetPasswordPage,
} from 'pages'
import Splash from 'layouts/Splash/Splash'
import {
  AssetsPage,
  ExchangePage,
  LOCPage,
  OperationsPage,
  RewardsPage,
  SettingsPage,
  VotingPage,
  WalletsPage,
  WalletPage,
  DepositsPage,
  DepositPage,
  AddWalletPage,
} from 'pages/lib'
import { store, history } from './redux/configureStore'
import ls from './utils/LocalStorage'
import './styles/themes/default.scss'

const requireAuth = (nextState, replace) => {
  if (!ls.isSession()) {
    // pass here only for Test RPC session.
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
      <Route component={Markup} onEnter={requireAuth}>
        <Route path='wallets' component={WalletsPage} />
        <Route path='wallet' component={WalletPage} />
        <Route path='add-wallet' component={AddWalletPage} />
        <Route path='deposits' component={DepositsPage} />
        <Route path='deposit' component={DepositPage} />
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
        <Route path='/create-account' component={CreateAccountPage} />
        <Route path='/' component={LoginPage} />
        <Route path='/select-wallet' component={SelectWalletPage} />
        <Route path='/recover' component={RecoverAccountPage} />
        <Route path='/reset-password' component={ResetPasswordPage} />
        <Route path='*' component={NotFoundPage} />
      </Route>
    </Router>
  </Provider>
)

export default router
