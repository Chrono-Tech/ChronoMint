/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { stopSubmit } from 'redux-form/immutable'
import {
  FORM_CREATE_ACCOUNT,
} from '../../redux/actions'
import CreateAccount from './CreateAccount'

export default class CreateAccountContainer extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    onSubmitSuccess: PropTypes.func,
  }

  async handleSubmit (values) {
    const { onSubmit } = this.props

    const walletName = values.get('walletName')
    const password = values.get('password')

    return onSubmit({
      walletName,
      password,
    })
  }

  handleSubmitSuccess (result) {
    const { onSubmitSuccess } = this.props

    onSubmitSuccess && onSubmitSuccess(result)
  }

  handleSubmitFail (errors, dispatch, submitErrors) {
    dispatch(stopSubmit(FORM_CREATE_ACCOUNT, submitErrors && submitErrors.errors))
  }

  render () {

    return (
      <CreateAccount
        onSubmit={this.handleSubmit.bind(this)}
        onSubmitFail={this.handleSubmitFail.bind(this)}
        onSubmitSuccess={this.handleSubmitSuccess.bind(this)}
      />
    )
  }
}
