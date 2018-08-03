/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  resetPasswordAccount,
} from '@chronobank/core/redux/persistAccount/actions'
import {
  DUCK_PERSIST_ACCOUNT,
} from '@chronobank/core/redux/persistAccount/constants'
import {
  navigateToSelectWallet,
  navigateToLoginPage,
} from '@chronobank/login-ui/redux/actions'
import {
  ResetPasswordContainer,
  RecoverAccountContainer,
  AccountSelectorContainer,
} from '@chronobank/login-ui/components'

function mapStateToProps (state) {
  const persistAccount = state.get(DUCK_PERSIST_ACCOUNT)
  return {
    selectedWallet: persistAccount.selectedWallet,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    navigateToLoginPage: () => dispatch(navigateToLoginPage()),
    resetPasswordAccount: async (wallet, mnemonic, password) => await dispatch(resetPasswordAccount(wallet, mnemonic, password)),
  }
}

class RecoverAccountPage extends PureComponent {
  static PAGES = {
    RECOVER_ACCOUNT_FORM: 1,
    RESET_PASSWORD_FORM: 2,
    SELECT_WALLET_FORM: 3,
  }

  static propTypes = {
    resetPasswordAccount: PropTypes.func,
    navigateToSelectWallet: PropTypes.func,
    navigateToSelectImportMethod: PropTypes.func,
    navigateToLoginPage: PropTypes.func,
    onSubmitCreateAccountImportMnemonic: PropTypes.func,
    selectedWallet: PropTypes.object,
  }

  constructor (props) {
    super(props)

    this.state = {
      page: RecoverAccountPage.PAGES.RECOVER_ACCOUNT_FORM,
      mnemonic: null,
      selectedWallet: props.selectedWallet,
    }
  }

  getCurrentPage () {
    switch(this.state.page){
      case RecoverAccountPage.PAGES.RECOVER_ACCOUNT_FORM:
        return (
          <RecoverAccountContainer
            previousPage={this.previousPage.bind(this)}
            selectedWallet={this.state.selectedWallet}
            navigateToSelectWallet={this.navigateToSelectAccount.bind(this)}
            onSubmitSuccess={this.onSubmitMnemonicSuccess.bind(this)}
          />
        )

      case RecoverAccountPage.PAGES.RESET_PASSWORD_FORM:
        return (
          <ResetPasswordContainer
            previousPage={this.previousPage.bind(this)}
            selectedWallet={this.state.selectedWallet}
            onSubmit={this.onSubmitResetPassword.bind(this)}
          />
        )

      case RecoverAccountPage.PAGES.SELECT_WALLET_FORM:
        return (
          <AccountSelectorContainer
            onWalletSelect={this.onWalletSelect.bind(this)}
          />
        )

      default:
        return (
          <RecoverAccountContainer
            previousPage={this.previousPage.bind(this)}
            selectedWallet={this.state.selectedWallet}
            navigateToSelectWallet={this.navigateToSelectAccount.bind(this)}
            onSubmitSuccess={this.onSubmitMnemonicSuccess.bind(this)}
          />
        )
    }
  }

  navigateToSelectAccount () {
    this.setState({
      page: RecoverAccountPage.PAGES.SELECT_WALLET_FORM,
    })
  }

  onWalletSelect (selectedWallet) {
    console.log('selected', selectedWallet)
    this.setState({
      selectedWallet,
      page: RecoverAccountPage.PAGES.RECOVER_ACCOUNT_FORM,
    })
  }

  onSubmitMnemonicSuccess ({ mnemonic }) {
    this.setState({
      mnemonic,
      page: RecoverAccountPage.PAGES.RESET_PASSWORD_FORM,
    })
  }

  async onSubmitResetPassword ({ password }) {
    const { selectedWallet, mnemonic } = this.state
    await this.props.resetPasswordAccount(selectedWallet, mnemonic, password)
    this.props.navigateToLoginPage()
  }

  previousPage () {
    if (this.state.page === RecoverAccountPage.PAGES.RECOVER_ACCOUNT_FORM){
      this.props.navigateToSelectImportMethod()
    } else {
      this.setState ({ page: this.state.page - 1 })
    }
  }

  render () {

    return this.getCurrentPage()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecoverAccountPage)
