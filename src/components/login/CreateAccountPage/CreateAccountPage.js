/**
 * Copyright 2017–2019, LaborX PTY
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
import {
  CreateAccountContainer,
  GenerateWalletContainer,
  GenerateMnemonicContainer,
  ConfirmMnemonicContainer,
  BlockchainChoiceContainer,
} from '@chronobank/login-ui/components'
import { updateBlockchainActivity } from '@chronobank/core/redux/persistAccount/actions'

function mapDispatchToProps (dispatch) {
  return {
    updateBlockchainsList: (blockchainList) => dispatch(updateBlockchainActivity(blockchainList)),
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    onSubmitCreateAccountImportMnemonic: (name, password, mnemonic) => dispatch(onSubmitCreateAccountImportMnemonic(name, password, mnemonic)),
  }
}

class CreateAccountPage extends PureComponent {
  static PAGES = {
    CREATE_ACCOUNT_FORM: 1,
    GENERATE_MNEMONIC_FORM: 2,
    CONFIRM_MNEMONIC_FORM: 3,
    BLOCKCHAIN_CHOICE_FORM: 4,
    DOWNLOAD_WALLET_PAGE: 5,
  }

  static propTypes = {
    updateBlockchainsList: PropTypes.func,
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
      mnemonic: bip39.generateMnemonic(),
    }
  }

  getCurrentPage () {
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
          mnemonic={this.state.mnemonic}
          onProceed={this.onProceedGenerateMnemonic.bind(this)}
        />
      )

    case CreateAccountPage.PAGES.CONFIRM_MNEMONIC_FORM:
      return (
        <ConfirmMnemonicContainer
          mnemonic={this.state.mnemonic}
          onSubmit={this.onSubmitConfirmMnemonic.bind(this)}
          previousPage={this.previousPage.bind(this)}
        />
      )

    case CreateAccountPage.PAGES.BLOCKCHAIN_CHOICE_FORM:
      return (
        <BlockchainChoiceContainer
          previousPage={this.previousPage.bind(this)}
          onSubmitSuccess={this.onSubmitBlockchainChoiceFormSuccess.bind(this)}
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

  onProceedGenerateMnemonic () {
    this.setState({
      page: CreateAccountPage.PAGES.CONFIRM_MNEMONIC_FORM,
    })
  }

  async onSubmitBlockchainChoiceFormSuccess (blockchainList) {
    await this.props.updateBlockchainsList(blockchainList.toJS())

    this.setState({
      page: CreateAccountPage.PAGES.DOWNLOAD_WALLET_PAGE,
    })
  }

  onSubmitConfirmMnemonic () {
    const { onSubmitCreateAccountImportMnemonic } = this.props
    const { accountName, password, mnemonic } = this.state

    onSubmitCreateAccountImportMnemonic(accountName, password, mnemonic)

    this.setState({
      page: CreateAccountPage.PAGES.BLOCKCHAIN_CHOICE_FORM,
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
