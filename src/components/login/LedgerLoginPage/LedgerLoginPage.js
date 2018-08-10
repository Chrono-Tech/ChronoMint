/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { onWalletSelect } from '@chronobank/login-ui/redux/thunks'
import {
  LoginWithLedgerContainer,
} from '@chronobank/login-ui/components'

function mapDispatchToProps (dispatch) {
  return {
    onDeviceSelect: (wallet) => dispatch(onDeviceSelect(wallet)),
  }
}

class LedgerLoginPage extends PureComponent {
  static propTypes = {
    onWalletSelect: PropTypes.func,
  }

  render () {

    return (
      <LoginWithLedgerContainer onWalletSelect={this.props.onDeviceSelect} />
    )
  }
}

export default connect(null, mapDispatchToProps)(LedgerLoginPage)
