/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  onSubmitCreateAccountImportPrivateKey,
  onCreateWalletFromJSON,
} from '@chronobank/login-ui/redux/thunks'
import {
  navigateToSelectWallet,
  navigateToSelectImportMethod,
  navigateToLoginPage,
} from '@chronobank/login-ui/redux/actions'
import {
  LoginWithWalletContainer,
  AccountNameContainer,
} from '@chronobank/login-ui/components'
import { SubmissionError } from 'redux-form'
import profileService from '@chronobank/login/network/ProfileService'
import { getAddress } from '@chronobank/core/redux/persistAccount/utils'

function mapDispatchToProps (dispatch) {
  return {
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    navigateToLoginPage: () => dispatch(navigateToLoginPage()),
    onCreateWalletFromJSON: (name, walletJSON, profile) => dispatch(onCreateWalletFromJSON(name, walletJSON, profile)),
    onSubmitCreateAccountImportPrivateKey: (name, password, mnemonic) => dispatch(onSubmitCreateAccountImportPrivateKey(name, password, mnemonic)),
  }
}

class WalletImportPage extends PureComponent {
  static PAGES = {
    WALLET_UPLOAD_FORM: 1,
    ACCOUNT_NAME_FORM: 2,
  }

  static propTypes = {
    previousPage: PropTypes.func.isRequired,
    nextPage: PropTypes.func.isRequired,
    navigateToSelectWallet: PropTypes.func,
    navigateToSelectImportMethod: PropTypes.func,
    navigateToLoginPage: PropTypes.func,
    onSubmitCreateAccountImportPrivateKey: PropTypes.func,
    onCreateWalletFromJSON: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)

    this.state = {
      page: WalletImportPage.PAGES.WALLET_UPLOAD_FORM,
      walletJSON: null,
    }
  }

  getCurrentPage () {
    switch(this.state.page){
      case WalletImportPage.PAGES.WALLET_UPLOAD_FORM:
        return (
          <LoginWithWalletContainer
            previousPage={this.previousPage.bind(this)}
            onSubmit={this.onSubmitWallet.bind(this)}
          />
        )

      case WalletImportPage.PAGES.ACCOUNT_NAME_FORM:
        return (
          <AccountNameContainer
            previousPage={this.previousPage.bind(this)}
            onSubmit={this.onSubmitAccountName.bind(this)}
          />
        )

      default:
        return (
          <LoginWithWalletContainer
            previousPage={this.previousPage.bind(this)}
            onSubmitSuccess={this.onSubmitPrivateKey.bind(this)}
          />
        )
    }
  }

  convertWalletFileToJSON (walletString) {
    let restoredWalletJSON

    try {
      restoredWalletJSON = JSON.parse(walletString)

      if ('Crypto' in restoredWalletJSON) {
        restoredWalletJSON.crypto = restoredWalletJSON.Crypto
        delete restoredWalletJSON.Crypto
      }
    } catch (e) {
      throw new SubmissionError({ _error: 'Broken wallet file' })
    }

    if (!restoredWalletJSON.address) {
      throw new SubmissionError({ _error: 'Wrong wallet address' })
    }

    return restoredWalletJSON
  }

  async onSubmitWallet (walletString) {
    let walletJSON = this.convertWalletFileToJSON(walletString)
    this.setState({ walletJSON })

    let response = null, userName = null, profile = null

    // If profile has been got && profile does exist && userName != null then create wallet
    try {
      response = await profileService.getPersonInfo([getAddress(walletJSON.address, true)])

      profile = response.data[0]
      userName = profile.userName

      if (userName){
        this.props.onCreateWalletFromJSON(userName, walletJSON, profile)
        this.props.navigateToSelectWallet()
      } else {
        this.nextPage()
      }

    } catch (e) {
      this.nextPage()
    }
  }

  async onSubmitAccountName (accountName) {
    const { onCreateWalletFromJSON, navigateToSelectWallet } = this.props

    onCreateWalletFromJSON(accountName, this.state.walletJSON, null)
    navigateToSelectWallet()
  }

  nextPage () {
    this.setState ({ page: this.state.page + 1 })
  }

  previousPage () {
    if (this.state.page === WalletImportPage.PAGES.WALLET_UPLOAD_FORM){
      this.props.navigateToSelectImportMethod()
    } else {
      this.setState ({ page: this.state.page - 1 })
    }
  }

  render () {

    return this.getCurrentPage()
  }
}

export default connect(null, mapDispatchToProps)(WalletImportPage)
