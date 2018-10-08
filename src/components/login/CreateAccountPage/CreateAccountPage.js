/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bip39 from 'bip39'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  onSubmitCreateAccountImportMnemonic,
} from '@chronobank/login-ui/redux/thunks'
import {
  navigateToSelectImportMethod,
} from '@chronobank/login-ui/redux/navigation'
import CreateAccountContainer from '@chronobank/login-ui/components/CreateAccount/CreateAccountContainer'
import GenerateWalletContainer from '@chronobank/login-ui/components/GenerateWallet/GenerateWalletContainer'
import GenerateMnemonicContainer from '@chronobank/login-ui/components/GenerateMnemonic/GenerateMnemonicContainer'
import ConfirmMnemonicContainer from '@chronobank/login-ui/components/ConfirmMnemonic/ConfirmMnemonicContainer'

const mapDispatchToProps = (dispatch) => {
  return {
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    onSubmitCreateAccountImportMnemonic: (name, password, mnemonic) => dispatch(onSubmitCreateAccountImportMnemonic(name, password, mnemonic)),
  }
}

@connect(null, mapDispatchToProps)
export default class CreateAccountPage extends PureComponent {
  static PAGES = {
    CREATE_ACCOUNT_FORM: 1,
    GENERATE_MNEMONIC_FORM: 2,
    CONFIRM_MNEMONIC_FORM: 3,
    DOWNLOAD_WALLET_PAGE: 4,
  }

  static propTypes = {
    navigateToSelectImportMethod: PropTypes.func,
    onSubmitCreateAccountImportMnemonic: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      page: CreateAccountPage.PAGES.CREATE_ACCOUNT_FORM,
      accountName: null,
      password: null,
      mnemonic: bip39.generateMnemonic(),
    }
  }

  handleCreateAccount = ({ walletName, password }) => {
    this.setState({
      accountName: walletName,
      password,
      page: CreateAccountPage.PAGES.GENERATE_MNEMONIC_FORM,
    })
  }

  handleProceedGenerateMnemonic = () => {
    this.setState({
      page: CreateAccountPage.PAGES.CONFIRM_MNEMONIC_FORM,
    })
  }

  handleSubmitConfirmMnemonic = () => {
    const { onSubmitCreateAccountImportMnemonic } = this.props
    const { accountName, password, mnemonic } = this.state

    onSubmitCreateAccountImportMnemonic(accountName, password, mnemonic)

    this.setState({
      page: CreateAccountPage.PAGES.DOWNLOAD_WALLET_PAGE,
    })
  }

  getCurrentPage () {
    switch(this.state.page){
      case CreateAccountPage.PAGES.CREATE_ACCOUNT_FORM:
        return (
          <CreateAccountContainer
            onSubmit={this.handleCreateAccount}
          />
        )

      case CreateAccountPage.PAGES.GENERATE_MNEMONIC_FORM:
        return (
          <GenerateMnemonicContainer
            mnemonic={this.state.mnemonic}
            onProceed={this.handleProceedGenerateMnemonic}
          />
        )

      case CreateAccountPage.PAGES.CONFIRM_MNEMONIC_FORM:
        return (
          <ConfirmMnemonicContainer
            mnemonic={this.state.mnemonic}
            onSubmit={this.handleSubmitConfirmMnemonic}
            previousPage={this.previousPage}
          />
        )

      case CreateAccountPage.PAGES.DOWNLOAD_WALLET_PAGE:
        return (
          <GenerateWalletContainer />
        )

      default:
        return (
          <CreateAccountContainer
            onSubmit={this.handleCreateAccount}
          />
        )

    }
  }

  previousPage = () => {
    if (this.state.page === CreateAccountPage.PAGES.MNEMONIC_FORM){
      this.props.navigateToSelectImportMethod()
    } else {
      this.setState ({ page: this.state.page - 1 })
    }
  }

  render () {
    return this.getCurrentPage()
  }
}
