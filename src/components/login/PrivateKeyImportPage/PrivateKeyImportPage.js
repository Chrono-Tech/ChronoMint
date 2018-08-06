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
} from '@chronobank/login-ui/redux/actions'
import {
  LoginWithPrivateKeyContainer,
  CreateAccountContainer,
  GenerateWalletContainer,
} from '@chronobank/login-ui/components'

function mapDispatchToProps (dispatch) {
  return {
    downloadWallet: () => dispatch(downloadWallet()),
    accountDeselect: () => dispatch(accountDeselect()),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    onSubmitCreateAccountImportPrivateKey: (name, password, mnemonic) => dispatch(onSubmitCreateAccountImportPrivateKey(name, password, mnemonic)),
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
    onSubmitCreateAccountImportPrivateKey: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      page: PrivateKeyImportPage.PAGES.PRIVATE_KEY_FORM,
      privateKey: null,
    }
  }

  getCurrentPage () {
    switch(this.state.page){
      case PrivateKeyImportPage.PAGES.PRIVATE_KEY_FORM:
        return (
          <LoginWithPrivateKeyContainer
            previousPage={this.previousPage.bind(this)}
            onSubmitSuccess={this.onSubmitPrivateKey.bind(this)}
          />
        )

      case PrivateKeyImportPage.PAGES.CREATE_ACCOUNT_FORM:
        return (
          <CreateAccountContainer
            privateKey={this.state.privateKey}
            previousPage={this.previousPage.bind(this)}
            onSubmit={this.onSubmitCreateAccount.bind(this)}
            onSubmitSuccess={this.nextPage.bind(this)}
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

  onSubmitPrivateKey ({ privateKey }) {
    this.setState({ privateKey })
    this.nextPage()
  }

  async onSubmitCreateAccount ({ walletName, password }) {
    const { onSubmitCreateAccountImportPrivateKey } = this.props

    return onSubmitCreateAccountImportPrivateKey(walletName, password, this.state.privateKey)
  }

  nextPage () {
    this.setState ({ page: this.state.page + 1 })
  }

  previousPage () {
    if (this.state.page === PrivateKeyImportPage.PAGES.PRIVATE_KEY_FORM){
      this.props.navigateToSelectImportMethod()
    } else {
      this.setState ({ page: this.state.page - 1 })
    }
  }

  render () {

    return this.getCurrentPage()
  }
}

export default connect(null, mapDispatchToProps)(PrivateKeyImportPage)
