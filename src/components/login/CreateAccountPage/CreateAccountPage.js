/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  onSubmitCreateAccountImportMnemonic,
} from '@chronobank/login-ui/redux/thunks'
import {
  navigateToSelectWallet,
  navigateToSelectImportMethod,
} from '@chronobank/login-ui/redux/actions'
import {
  CreateAccountContainer,
  GenerateWalletContainer,
  GenerateMnemonicContainer,
  ConfirmMnemonicContainer,
} from '@chronobank/login-ui/components'

function mapDispatchToProps (dispatch) {
  return {
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    onSubmitCreateAccountImportMnemonic: (name, password, mnemonic) => dispatch(onSubmitCreateAccountImportMnemonic(name, password, mnemonic)),
  }
}

class CreateAccountPage extends PureComponent {
  static PAGES = {
    CREATE_ACCOUNT_FORM: 1,
    GENERATE_MNEMONIC_FORM: 2,
    CONFIRM_MNEMONIC_FORM: 3,
    DOWNLOAD_WALLET_PAGE: 4,
  }

  static propTypes = {
    previousPage: PropTypes.func.isRequired,
    nextPage: PropTypes.func.isRequired,
    navigateToSelectWallet: PropTypes.func,
    navigateToSelectImportMethod: PropTypes.func,
    onSubmitCreateAccountImportMnemonic: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      page: CreateAccountPage.PAGES.CREATE_ACCOUNT_FORM,
      accountName: null,
      password: null,
      mnemonic: null,
    }
  }

  getCurrentPage () {
    console.log('getcurrentpage', this.props)
    switch(this.state.page){
      case CreateAccountPage.PAGES.CREATE_ACCOUNT_FORM:
        return (
          <CreateAccountContainer
            onSubmit={this.onSubmitCreateAccount.bind(this)}
          />
        )

      case CreateAccountPage.PAGES.GENERATE_MNEMONIC_FORM:
        return (
          <GenerateMnemonicContainer
            onProceed={this.onProceedGenerateMnemonic.bind(this)}
          />
        )

      case CreateAccountPage.PAGES.CONFIRM_MNEMONIC_FORM:
        return (
          <ConfirmMnemonicContainer
            mnemonic={this.state.mnemonic}
            onSubmit={this.onSubmitConfirmMnemonic.bind(this)}
          />
        )

      case CreateAccountPage.PAGES.DOWNLOAD_WALLET_PAGE:
        return (
          <GenerateWalletContainer />
        )

      default:
        return (
          <CreateAccountContainer
            onSubmit={this.onSubmitCreateAccount.bind(this)}
          />
        )

    }
  }

  onSubmitCreateAccount ({ walletName, password }) {
    this.setState({
      accountName: walletName,
      password,
      page: CreateAccountPage.PAGES.GENERATE_MNEMONIC_FORM,
    })
  }

  onProceedGenerateMnemonic (mnemonic) {
    this.setState({
      mnemonic,
      page: CreateAccountPage.PAGES.CONFIRM_MNEMONIC_FORM,
    })
  }

  onSubmitConfirmMnemonic () {
    const { onSubmitCreateAccountImportMnemonic } = this.props
    const { accountName, password, mnemonic } = this.state

    onSubmitCreateAccountImportMnemonic(accountName, password, mnemonic)

    this.setState({
      page: CreateAccountPage.PAGES.DOWNLOAD_WALLET_PAGE,
    })
  }

  previousPage () {
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

export default connect(null, mapDispatchToProps)(CreateAccountPage)
