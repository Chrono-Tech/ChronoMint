/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import Markup from 'layouts/Markup'
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router/immutable'
import LoginForm from '@chronobank/login-ui/components/LoginForm/LoginForm'
import NotFoundPage from '@chronobank/login-ui/components/NotFoundPage/NotFoundPage'
import LoginWithOptions from '@chronobank/login-ui/components/LoginWithOptions/LoginWithOptions'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
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
import AccountSelectorContainer from '@chronobank/login-ui/components/AccountSelector/AccountSelectorContainer'
import CreateAccountPage from 'components/login/CreateAccountPage/CreateAccountPage'
import './styles/themes/default.scss'

const NotFound = () => (
  <Splash> <NotFoundPage /> </Splash>
)

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

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.get(DUCK_SESSION).isSession,
  }
}
class IsUserAuth extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
  }
  static defaultProps = {
    isLoggedIn: false,
  }
  render () {
    return this.props.isLoggedIn
      ? (
        <Redirect from='/' to='/wallets' />
      ) : (
        <Redirect from='/' to='/login' />
      )
  }
}
const CIsUserAuth = connect(mapStateToProps, null)(IsUserAuth)

const router = (history) => (
  <ConnectedRouter history={history} onUpdate={hashLinkScroll}>
    <div>
      <Switch>
        <Splash>
          <Route exact path='/' component={CIsUserAuth} />
          <Route exact path='/login' component={LoginForm} />
          <Route exact path='/create-account' component={CreateAccountPage} />
          <Route exact path='/import-methods' component={LoginWithOptions} />
          <Route exact path='/ledger-login' component={LedgerLoginPage} />
          <Route exact path='/mnemonic-login' component={MnemonicImportPage} />
          <Route exact path='/plugin-login' component={MetamaskLoginPage} />
          <Route exact path='/private-key-login' component={PrivateKeyImportPage} />
          <Route exact path='/recover-account' component={RecoverAccountPage} />
          <Route exact path='/select-account' component={AccountSelectorContainer} />
          <Route exact path='/trezor-login' component={TrezorLoginPage} />
          <Route exact path='/upload-wallet' component={WalletImportPage} />
        </Splash>
        <Markup>
          <Route exact path='/2fa' component={TwoFAPage} />
          <Route exact path='/wallets' component={WalletsPage} />
          <Route exact path='/wallet' component={WalletPage} />
          <Route exact path='/add-wallet' component={AddWalletPage} />
          <Route exact path='/deposits' component={DepositsPage} />
          <Route exact path='/deposit' component={DepositPage} />
          <Route exact path='/rewards' component={RewardsPage} />
          <Route exact path='/voting' component={VotingPage} />
          <Route exact path='/poll' component={PollPage} />
          <Route exact path='/new-poll' component={NewPollPage} />
          <Route exact path='/vote-history' component={VoteHistoryPage} />
          <Route exact path='/assets' component={AssetsPage} />
        </Markup>
        <Route component={NotFound} />
      </Switch>
    </div>
  </ConnectedRouter>
)

export default router
