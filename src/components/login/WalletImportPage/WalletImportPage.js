/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  onSubmitMnemonicLoginForm,
  onSubmitMnemonicLoginFormSuccess,
  onSubmitMnemonicLoginFormFail,
} from '@chronobank/login-ui/redux/thunks'
import {
  FORM_MNEMONIC_LOGIN_PAGE,
} from '@chronobank/login-ui/redux/actions'
import {
  LoginWithWallet,
  CreateAccount,
} from '@chronobank/login-ui/components'

function mapDispatchToProps (dispatch) {
  return {
    onSubmitPrivateKeyForm: async (values) => {
      const confirmMnemonic = values.get('mnemonic')
      await dispatch(onSubmitMnemonicLoginForm(confirmMnemonic))
    },
    onSubmitSuccessPrivateKeyForm: () => dispatch(onSubmitMnemonicLoginFormSuccess()),
    onSubmitFailPrivateKeyForm: (errors, dispatch, submitErrors) => dispatch(onSubmitMnemonicLoginFormFail(errors, submitErrors)),
  }
}

class WalletImportPage extends PureComponent {
  static PAGES = {
    WALLET_FORM: 1,
    CREATE_ACCOUNT_FORM: 2,
  }

  constructor (props){
    super(props)

    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)

    this.state = {
      page: WalletImportPage.PAGES.MNEMONIC_FORM,
    }
  }

  nextPage () {
    if (this.state.page === WalletImportPage.PAGES.CREATE_ACCOUNT_FORM) {
      this.props.nextPage()
    } else {
      this.setState({ page: this.state.page + 1 })
    }

  }

  previousPage () {
    if (this.state.page === WalletImportPage.PAGES.WALLET_FORM) {
      this.props.previousPage()
    } else {
      this.setState({ page: this.state.page - 1 })
    }

  }

  getCurrentPage (){
    switch(this.state.page){
      case WalletImportPage.PAGES.WALLET_FORM:
        return (
          <LoginWithWallet />
        )

      case WalletImportPage.PAGES.CREATE_ACCOUNT_FORM:
        return (
          <CreateAccount />
        )

      default:
        return (
          <LoginWithWallet />
        )
    }
  }

  render () {

    return this.getCurrentPage()
  }
}

export default connect(null, mapDispatchToProps)(WalletImportPage)
