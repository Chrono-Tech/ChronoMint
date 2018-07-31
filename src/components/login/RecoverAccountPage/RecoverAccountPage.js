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
  onSubmitCreateAccountImportMnemonic,
} from '@chronobank/login-ui/redux/thunks'
import {
  navigateToSelectWallet,
  navigateToSelectImportMethod,
} from '@chronobank/login-ui/redux/actions'
import {
  ResetPasswordContainer,
  RecoverAccountContainer
} from '@chronobank/login-ui/components'

function mapDispatchToProps (dispatch) {
  return {
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
 }
}

class RecoverAccountPage extends PureComponent {
  static PAGES = {
    MNEMONIC_RESET_FORM: 1,
    RESET_PASSWORD_FORM: 2,
  }

  static propTypes = {
    navigateToSelectWallet: PropTypes.func,
    navigateToSelectImportMethod: PropTypes.func,
    onSubmitCreateAccountImportMnemonic: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      page: RecoverAccountPage.PAGES.MNEMONIC_RESET_FORM,
      mnemonic: null,
    }
  }

  getCurrentPage () {
    switch(this.state.page){
      case RecoverAccountPage.PAGES.MNEMONIC_RESET_FORM:
        return (
          <RecoverAccountContainer
            previousPage={this.previousPage.bind(this)}
            onSubmitSuccess={this.onSubmitMnemonic.bind(this)}
          />
        )

      case RecoverAccountPage.PAGES.RESET_PASSWORD_FORM:
        return (
          <ResetPasswordContainer
            previousPage={this.previousPage.bind(this)}
            onSubmit={this.onSubmitCreateAccount.bind(this)}
            onSubmitSuccess={this.onSubmitCreateAccountSuccess.bind(this)}
          />
        )

      default:
        return (
          <RecoverAccountContainer
            previousPage={this.previousPage.bind(this)}
            onSubmitSuccess={this.onSubmitMnemonic.bind(this)}
          />
        )
    }
  }


  nextPage () {
    this.setState ({ page: this.state.page + 1 })
  }

  previousPage () {
    if (this.state.page === RecoverAccountPage.PAGES.MNEMONIC_FORM){
      this.props.navigateToSelectImportMethod()
    } else {
      this.setState ({ page: this.state.page - 1 })
    }
  }

  render () {

    return this.getCurrentPage()
  }
}

export default connect(null, mapDispatchToProps)(RecoverAccountPage)
