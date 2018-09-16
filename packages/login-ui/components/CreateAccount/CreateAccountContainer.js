/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { stopSubmit } from 'redux-form/immutable'
import { connect } from 'react-redux'
import AccountProfileModel from '@chronobank/core/models/wallet/persistAccount/AccountProfileModel'
import {
  navigateToSelectWallet,
} from '../../redux/navigation'
import {
  FORM_CREATE_ACCOUNT,
} from '../../redux/constants'
import CreateAccount from './CreateAccount'

const mapDispatchToProps = (dispatch) => {
  return {
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
  }
}

@connect(null, mapDispatchToProps)
export default class CreateAccountContainer extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
    navigateToSelectWallet: PropTypes.func,
    accountProfile: PropTypes.instanceOf(AccountProfileModel),
  }

  handleSubmit = (values) => {
    const { onSubmit } = this.props
    const walletName = values.get('walletName')
    const password = values.get('password')

    return onSubmit({
      walletName,
      password,
    })
  }

  handleSubmitSuccess = (result) => {
    const { onSubmitSuccess } = this.props
    onSubmitSuccess && onSubmitSuccess(result)
  }

  handleSubmitFail = (errors, dispatch, submitErrors) => {
    dispatch(stopSubmit(FORM_CREATE_ACCOUNT, submitErrors && submitErrors.errors))
  }

  render () {
    const { accountProfile } = this.props
    return (
      <CreateAccount
        accountProfile={accountProfile}
        initialValues={{
          walletName: accountProfile ? accountProfile.userName : '',
        }}
        onSubmit={this.handleSubmit}
        onSubmitFail={this.handleSubmitFail}
        onSubmitSuccess={this.handleSubmitSuccess}
        navigateToSelectWallet={this.props.navigateToSelectWallet}
      />
    )
  }
}
