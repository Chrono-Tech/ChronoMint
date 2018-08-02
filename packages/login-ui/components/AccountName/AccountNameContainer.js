/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import AccountName from './AccountName'

export default class LoginWithPrivateKeyContainer extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  handleSubmit (values) {
    const { onSubmit } = this.props
    let accountName = values.get('accountName')

    accountName = accountName.trim()

    onSubmit && onSubmit(accountName)
  }

  render () {
    return (
      <AccountName
        onSubmit={this.handleSubmit.bind(this)}
        previousPage={this.props.previousPage}
      />
    )
  }
}
