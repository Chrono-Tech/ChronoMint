/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { onWalletSelect } from '@chronobank/login-ui/redux/thunks'
import {
  LoginWithTrezorContainer,
} from '@chronobank/login-ui/components'

function mapDispatchToProps (dispatch) {
  return {
    onDeviceSelect: (wallet) => dispatch(onDeviceSelect(wallet)),
  }
}

class TrezorLoginPage extends PureComponent {
  static propTypes = {
    onDeviceSelect: PropTypes.func,
  }

  render () {

    return (
      <LoginWithTrezorContainer onWalletSelect={this.props.onWalletSelect} />
    )
  }
}

export default connect(null, mapDispatchToProps)(LoginWithTrezorContainer)
