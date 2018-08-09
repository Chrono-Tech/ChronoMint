/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  downloadWallet,
  accountDeselect,
} from '@chronobank/core/redux/persistAccount/actions'
import {
  onSubmitCreateAccountImportPrivateKey,
} from '@chronobank/login-ui/redux/thunks'
import {
  navigateToSelectWallet,
  navigateToSelectImportMethod,
  navigateBack,
} from '@chronobank/login-ui/redux/actions'
import {
  LoginWithPrivateKeyContainer,
  CreateAccountContainer,
  GenerateWalletContainer,
} from '@chronobank/login-ui/components'
import ProfileService from '@chronobank/login/network/ProfileService'
import AccountProfileModel from '@chronobank/core/models/wallet/persistAccount/AccountProfileModel'
import {
  getAddressByPrivateKey,
} from '@chronobank/core/redux/persistAccount/utils'

function mapDispatchToProps (dispatch) {
  return {
    downloadWallet: () => dispatch(downloadWallet()),
    accountDeselect: () => dispatch(accountDeselect()),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    navigateBack: () => dispatch(navigateBack()),
    onSubmitCreateAccountImportPrivateKey: async (name, password, mnemonic) => await dispatch(onSubmitCreateAccountImportPrivateKey(name, password, mnemonic)),
  }
}

class PrivateKeyImportPage extends PureComponent {
  static PAGES = {
    PRIVATE_KEY_FORM: 1,
    CREATE_ACCOUNT_FORM: 2,
    DOWNLOAD_WALLET_PAGE: 3,
  }

  static propTypes = {
    accountDeselect: PropTypes.func,
    downloadWallet: PropTypes.func,
    navigateToSelectWallet: PropTypes.func,
    navigateToSelectImportMethod: PropTypes.func,
    navigateBack: PropTypes.func,
    onSubmitCreateAccountImportPrivateKey: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      page: PrivateKeyImportPage.PAGES.PRIVATE_KEY_FORM,
      privateKey: null,
      accountProfile: null,
    }
  }

  getCurrentPage () {
    switch(this.state.page){
      case PrivateKeyImportPage.PAGES.PRIVATE_KEY_FORM:
        return (
          <LoginWithPrivateKeyContainer
            previousPage={this.previousPage.bind(this)}
            onSubmit={this.onSubmitPrivateKey.bind(this)}
          />
        )

      case PrivateKeyImportPage.PAGES.CREATE_ACCOUNT_FORM:
        return (
          <CreateAccountContainer
            privateKey={this.state.privateKey}
            accountProfile={this.state.accountProfile}
            previousPage={this.previousPage.bind(this)}
            onSubmit={this.onSubmitCreateAccount.bind(this)}
          />
        )

      case PrivateKeyImportPage.PAGES.DOWNLOAD_WALLET_PAGE:
        return (
          <GenerateWalletContainer />
        )

      default:
        return (
          <LoginWithPrivateKeyContainer
            previousPage={this.previousPage.bind(this)}
            onSubmitSuccess={this.onSubmitPrivateKey.bind(this)}
          />
        )
    }
  }

  async onSubmitPrivateKey ({ privateKey }) {
    const address = getAddressByPrivateKey(privateKey)

    const { data } = await ProfileService.getPersonInfo([address])

    const profile = data[0]

    this.setState({
      privateKey,
      accountProfile: profile && profile.userName ? new AccountProfileModel(profile): null,
      page: PrivateKeyImportPage.PAGES.CREATE_ACCOUNT_FORM,
    })
  }

  async onSubmitCreateAccount ({ walletName, password }) {
    const { onSubmitCreateAccountImportPrivateKey } = this.props

    await onSubmitCreateAccountImportPrivateKey(walletName, password, this.state.privateKey)

    this.setState({
      page: PrivateKeyImportPage.PAGES.DOWNLOAD_WALLET_PAGE,
    })
  }

  previousPage () {
    if (this.state.page === PrivateKeyImportPage.PAGES.PRIVATE_KEY_FORM){
      this.props.navigateBack()
    } else {
      this.setState ({ page: this.state.page - 1 })
    }
  }

  render () {

    return this.getCurrentPage()
  }
}

export default connect(null, mapDispatchToProps)(PrivateKeyImportPage)
