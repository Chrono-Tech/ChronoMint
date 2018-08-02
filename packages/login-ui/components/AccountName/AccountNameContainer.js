/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { navigateBack } from '@chronobank/login-ui/redux/actions'
import AccountName from './AccountName'

const mapDispatchToProps = (dispatch) => {
  return {
    navigateBack: () => dispatch(navigateBack()),
  }
}

class AccountNameContainer extends PureComponent {
  static propTypes = {
    navigateBack: PropTypes.func,
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
        previousPage={this.props.navigateBack}
      />
    )
  }
}

export default connect(null, mapDispatchToProps)(AccountNameContainer)
