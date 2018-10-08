/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router/immutable'
import LoginForm from '@chronobank/login-ui/components/LoginForm/LoginForm'
import NotFoundPage from '@chronobank/login-ui/components/NotFoundPage/NotFoundPage'
import LoginWithOptions from '@chronobank/login-ui/components/LoginWithOptions/LoginWithOptions'
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
import AccountSelectorContainer from '@chronobank/login-ui/components/AccountSelector/AccountSelectorContainer'
import CreateAccountPage from 'components/login/CreateAccountPage/CreateAccountPage'
import ProtectedRoute from 'components/ProtectedRoute/ProtectedRoute'
import LoginRoute from 'components/LoginRoute/LoginRoute'
import './styles/themes/default.scss'

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

export default class Router extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
  }

  render () {
    return (
      <ConnectedRouter history={this.props.history} onUpdate={hashLinkScroll}>
        <Switch>
          <LoginRoute exact path='/login' component={LoginForm} />
          <LoginRoute exact path='/create-account' component={CreateAccountPage} />
          <LoginRoute exact path='/import-methods' component={LoginWithOptions} />
          <LoginRoute exact path='/ledger-login' component={LedgerLoginPage} />
          <LoginRoute exact path='/mnemonic-login' component={MnemonicImportPage} />
          <LoginRoute exact path='/plugin-login' component={MetamaskLoginPage} />
          <LoginRoute exact path='/private-key-login' component={PrivateKeyImportPage} />
          <LoginRoute exact path='/recover-account' component={RecoverAccountPage} />
          <LoginRoute exact path='/select-account' component={AccountSelectorContainer} />
          <LoginRoute exact path='/trezor-login' component={TrezorLoginPage} />
          <LoginRoute exact path='/upload-wallet' component={WalletImportPage} />
          <ProtectedRoute exact path='/' component={WalletsPage} />
          <ProtectedRoute exact path='/2fa' component={TwoFAPage} />
          <ProtectedRoute exact path='/wallets' component={WalletsPage} />
          <ProtectedRoute exact path='/wallet' component={WalletPage} />
          <ProtectedRoute exact path='/add-wallet' component={AddWalletPage} />
          <ProtectedRoute exact path='/deposits' component={DepositsPage} />
          <ProtectedRoute exact path='/deposit' component={DepositPage} />
          <ProtectedRoute exact path='/rewards' component={RewardsPage} />
          <ProtectedRoute exact path='/voting' component={VotingPage} />
          <ProtectedRoute exact path='/poll' component={PollPage} />
          <ProtectedRoute exact path='/new-poll' component={NewPollPage} />
          <ProtectedRoute exact path='/vote-history' component={VoteHistoryPage} />
          <ProtectedRoute exact path='/assets' component={AssetsPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </ConnectedRouter>
    )
  }
}
