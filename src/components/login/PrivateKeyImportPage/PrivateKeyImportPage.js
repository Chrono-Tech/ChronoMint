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
  LoginWithPrivateKeyContainer,
  CreateAccountContainer,
} from '@chronobank/login-ui/components'

function mapDispatchToProps (dispatch) {
  return {
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    onSubmitCreateAccountImportMnemonic: (name, password, mnemonic) => dispatch(onSubmitCreateAccountImportMnemonic(name, password, mnemonic)),
  }
}

class PrivateKeyImportPage extends PureComponent {
  static PAGES = {
    PRIVATE_KEY_FORM: 1,
    CREATE_ACCOUNT_FORM: 2,
  }

  static propTypes = {
    previousPage: PropTypes.func.isRequired,
    nextPage: PropTypes.func.isRequired,
    navigateToSelectWallet: PropTypes.func,
    navigateToSelectImportMethod: PropTypes.func,
    onSubmitCreateAccountImportPrivateKey: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)

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
            onSubmitSuccess={this.onSubmitCreateAccountSuccess.bind(this)}
          />
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

  onSubmitCreateAccountSuccess () {
    this.props.navigateToSelectWallet()
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
