/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { stopSubmit } from 'redux-form'
import {
  FORM_DERIVATION_PATH,
} from '../../redux/constants'
import DerivationPathForm from './DerivationPathForm'

export default class DerivationPathFormContainer extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
  }

  static defaultProps = {
    previousPage: () => {}
  }

  async handleSubmit (values) {
    const { onSubmit } = this.props

    const path = values.get('path')

    return onSubmit({ path })
  }

  handleSubmitSuccess (result) {
    const { onSubmitSuccess } = this.props
    onSubmitSuccess && onSubmitSuccess(result)
  }

  handleSubmitFail (errors, dispatch, submitErrors) {
    dispatch(stopSubmit(FORM_DERIVATION_PATH, submitErrors && submitErrors.errors))
  }

  render () {
    return (
      <DerivationPathForm
        onSubmit={this.handleSubmit.bind(this)}
        onSubmitSuccess={this.handleSubmitSuccess.bind(this)}
        onSubmitFail={this.handleSubmitFail.bind(this)}
        previousPage={this.props.previousPage}
      />
    )
  }
}
