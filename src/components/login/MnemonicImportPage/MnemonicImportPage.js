/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import AccountProfileModel from '@chronobank/core/models/wallet/persistAccount/AccountProfileModel'
import {
  getAddressByMnemonic,
} from '@chronobank/core/redux/persistAccount/utils'
import {
  onSubmitCreateAccountImportMnemonic,
} from '@chronobank/login-ui/redux/thunks'
import {
  navigateToSelectWallet,
  navigateToSelectImportMethod,
  navigateBack,
} from '@chronobank/login-ui/redux/actions'
import {
  LoginWithMnemonicContainer,
  CreateAccountContainer,
  GenerateWalletContainer,
} from '@chronobank/login-ui/components'
import ProfileService from '@chronobank/login/network/ProfileService'

function mapDispatchToProps (dispatch) {
  return {
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    onSubmitCreateAccountImportMnemonic: async (name, password, mnemonic) => await dispatch(onSubmitCreateAccountImportMnemonic(name, password, mnemonic)),
    navigateBack: () => dispatch(navigateBack()),
  }
}

class MnemonicImportPage extends PureComponent {
  static PAGES = {
    MNEMONIC_FORM: 1,
    CREATE_ACCOUNT_FORM: 2,
    DOWNLOAD_WALLET_PAGE: 3,
    CREATE_ACCOUNT_LOADED_PROFILE: 4,
  }

  static propTypes = {
    navigateToSelectWallet: PropTypes.func,
    navigateToSelectImportMethod: PropTypes.func,
    navigateBack: PropTypes.func,
    onSubmitCreateAccountImportMnemonic: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      page: MnemonicImportPage.PAGES.MNEMONIC_FORM,
      mnemonic: null,
      accountProfile: null,
    }
  }

  getCurrentPage () {
    switch(this.state.page){
      case MnemonicImportPage.PAGES.MNEMONIC_FORM:
        return (
          <LoginWithMnemonicContainer
            previousPage={this.previousPage.bind(this)}
            onSubmit={this.onSubmitMnemonic.bind(this)}
          />
        )

      case MnemonicImportPage.PAGES.CREATE_ACCOUNT_FORM:
        return (
          <CreateAccountContainer
            mnemonic={this.state.mnemonic}
            accountProfile={this.state.accountProfile}
            previousPage={this.previousPage.bind(this)}
            onSubmit={this.onSubmitCreateAccount.bind(this)}
            onSubmitSuccess={this.onSubmitCreateAccountSuccess.bind(this)}
          />
        )

      case MnemonicImportPage.PAGES.DOWNLOAD_WALLET_PAGE:
        return (
          <GenerateWalletContainer />
        )

      default:
        return (
          <LoginWithMnemonicContainer
            previousPage={this.previousPage.bind(this)}
            onSubmitSuccess={this.onSubmitMnemonic.bind(this)}
          />
        )
    }
  }

  async onSubmitMnemonic ({ mnemonic }) {
    const address = getAddressByMnemonic(mnemonic)
    const { data } = await ProfileService.getPersonInfo([address])

    const profile = data[0]

    this.setState({
      mnemonic,
      accountProfile: profile && profile.userName ? new AccountProfileModel(profile): null,
      page: MnemonicImportPage.PAGES.CREATE_ACCOUNT_FORM,
    })

  }

  async onSubmitCreateAccount ({ walletName, password }) {
    const { onSubmitCreateAccountImportMnemonic } = this.props

    return onSubmitCreateAccountImportMnemonic(walletName, password, this.state.mnemonic)
  }

  onSubmitCreateAccountSuccess () {
    this.setState({
      page: MnemonicImportPage.PAGES.DOWNLOAD_WALLET_PAGE,
    })
  }

  previousPage () {
    if (this.state.page === MnemonicImportPage.PAGES.MNEMONIC_FORM){
      this.props.navigateBack()
    } else {
      this.setState ({ page: this.state.page - 1 })
    }
  }

  render () {

    return this.getCurrentPage()
  }
}

export default connect(null, mapDispatchToProps)(MnemonicImportPage)
