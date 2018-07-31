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
  LoginWithMnemonicContainer,
  CreateAccountContainer,
} from '@chronobank/login-ui/components'

function mapDispatchToProps (dispatch) {
  return {
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    onSubmitCreateAccountImportMnemonic: (name, password, mnemonic) => dispatch(onSubmitCreateAccountImportMnemonic(name, password, mnemonic)),
  }
}

class MnemonicImportPage extends PureComponent {
  static PAGES = {
    MNEMONIC_FORM: 1,
    CREATE_ACCOUNT_FORM: 2,
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

    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)

    this.state = {
      page: MnemonicImportPage.PAGES.MNEMONIC_FORM,
      mnemonic: null,
    }
  }

  getCurrentPage () {
    switch(this.state.page){
      case MnemonicImportPage.PAGES.MNEMONIC_FORM:
        return (
          <LoginWithMnemonicContainer
            previousPage={this.previousPage.bind(this)}
            onSubmitSuccess={this.onSubmitMnemonic.bind(this)}
          />
        )

      case MnemonicImportPage.PAGES.CREATE_ACCOUNT_FORM:
        return (
          <CreateAccountContainer
            mnemonic={this.state.mnemonic}
            previousPage={this.previousPage.bind(this)}
            onSubmit={this.onSubmitCreateAccount.bind(this)}
            onSubmitSuccess={this.onSubmitCreateAccountSuccess.bind(this)}
          />
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

  onSubmitMnemonic ({ mnemonic }) {
    this.setState({ mnemonic })
    this.nextPage()
  }

  async onSubmitCreateAccount ({ walletName, password }) {
    const { onSubmitCreateAccountImportMnemonic } = this.props

    return onSubmitCreateAccountImportMnemonic(walletName, password, this.state.mnemonic)
  }

  onSubmitCreateAccountSuccess () {
    this.props.navigateToSelectWallet()
  }

  nextPage () {
    this.setState ({ page: this.state.page + 1 })
  }

  previousPage () {
    if (this.state.page === MnemonicImportPage.PAGES.MNEMONIC_FORM){
      this.props.navigateToSelectImportMethod()
    } else {
      this.setState ({ page: this.state.page - 1 })
    }
  }

  render () {

    return this.getCurrentPage()
  }
}

export default connect(null, mapDispatchToProps)(MnemonicImportPage)
