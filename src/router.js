/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Markup from 'layouts/Markup'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router/immutable'
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

// TODO: Remove it and use https://reacttraining.com/react-router/web/guides/scroll-restoration
const hashLinkScroll = () => {
  const { hash } = window.location
  if (hash !== '') {
    setTimeout(() => {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) element.scrollIntoView()
    }, 0)
  }
}

const LoginRoutes = (props) => {
  const { match } = props
  return (
    <Splash {...props}>
      <Switch>
        <Route exact path={match.url}>
          <LoginForm />
        </Route>
        <Route exact path='/create-account'>
          <CreateAccountPage />
        </Route>
        <Route exact path='/select-account'>
          <AccountSelectorPage />
        </Route>
        <Route exact path='/recover-account'>
          <RecoverAccountPage />
        </Route>
        <Route exact path='/import-methods'>
          <LoginWithOptions />
        </Route>
        <Route exact path='/upload-wallet'>
          <WalletImportPage />
        </Route>
        <Route exact path='/trezor-login'>
          <TrezorLoginPage />
        </Route>
        <Route exact path='/ledger-login'>
          <LedgerLoginPage />
        </Route>
        <Route exact path='/plugin-login'>
          <MetamaskLoginPage />
        </Route>
        <Route exact path='/mnemonic-login'>
          <MnemonicImportPage />
        </Route>
        <Route exact path='/private-key-login'>
          <PrivateKeyImportPage />
        </Route>
      </Switch>
    </Splash>
  )
}

const WalletsRoutes = (props) => (
  <Markup {...props}>
    <Switch>
      <Route exact path='2fa'>
        <TwoFAPage />
      </Route>
      <Route exact path='wallets'>
        <WalletsPage />
      </Route>
      <Route exact path='wallet'>
        <WalletPage />
      </Route>
      <Route exact path='add-wallet'>
        <AddWalletPage />
      </Route>
      <Route exact path='deposits'>
        <DepositsPage />
      </Route>
      <Route exact path='deposit'>
        <DepositPage />
      </Route>
      <Route exact path='rewards'>
        <RewardsPage />
      </Route>
      <Route exact path='voting'>
        <VotingPage />
      </Route>
      <Route exact path='poll'>
        <PollPage />
      </Route>
      <Route exact path='new-poll'>
        <NewPollPage />
      </Route>
      <Route exact path='vote-history'>
        <VoteHistoryPage />
      </Route>
      <Route exact path='assets'>
        <AssetsPage />
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

const router = (history) => (
  <ConnectedRouter history={history} onUpdate={hashLinkScroll}>
    <div>
      <Splash>
        <Switch>
          <Route exact path='/'>
            <LoginForm />
          </Route>
          <Route exact path='/create-account'>
            <CreateAccountPage />
          </Route>
          <Route exact path='/select-account'>
            <AccountSelectorPage />
          </Route>
          <Route exact path='/recover-account'>
            <RecoverAccountPage />
          </Route>
          <Route exact path='/import-methods'>
            <LoginWithOptions />
          </Route>
          <Route exact path='/upload-wallet'>
            <WalletImportPage />
          </Route>
          <Route exact path='/trezor-login'>
            <TrezorLoginPage />
          </Route>
          <Route exact path='/ledger-login'>
            <LedgerLoginPage />
          </Route>
          <Route exact path='/plugin-login'>
            <MetamaskLoginPage />
          </Route>
          <Route exact path='/mnemonic-login'>
            <MnemonicImportPage />
          </Route>
          <Route exact path='/private-key-login'>
            <PrivateKeyImportPage />
          </Route>
        </Switch>
      </Splash>
      <Markup>
        <Switch>
          <Route exact path='/2fa'>
            <TwoFAPage />
          </Route>
          <Route exact path='/wallets'>
            <WalletsPage />
          </Route>
          <Route exact path='/wallet'>
            <WalletPage />
          </Route>
          <Route exact path='/add-wallet'>
            <AddWalletPage />
          </Route>
          <Route exact path='/deposits'>
            <DepositsPage />
          </Route>
          <Route exact path='/deposit'>
            <DepositPage />
          </Route>
          <Route exact path='/rewards'>
            <RewardsPage />
          </Route>
          <Route exact path='/voting'>
            <VotingPage />
          </Route>
          <Route exact path='/poll'>
            <PollPage />
          </Route>
          <Route exact path='/new-poll'>
            <NewPollPage />
          </Route>
          <Route exact path='/vote-history'>
            <VoteHistoryPage />
          </Route>
          <Route exact path='/assets'>
            <AssetsPage />
          </Route>
        </Switch>
      </Markup>
      <Route component={NotFound} />
    </div>
  </ConnectedRouter>
)

export default router
