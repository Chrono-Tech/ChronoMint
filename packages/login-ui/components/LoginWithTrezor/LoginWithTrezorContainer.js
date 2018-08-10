/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import {
  DUCK_PERSIST_ACCOUNT,
} from '@chronobank/core/redux/persistAccount/constants'
import {
  initLedgerDevice,
} from '@chronobank/login/redux/network/thunks'
import { DeviceEntryModel } from '@chronobank/core/models/wallet/persistAccount'
import './LoginWithTrezor.scss'
import {
  navigateToSelectImportMethod,
  navigateToCreateAccount,
} from '../../redux/actions'
import LoginWithTrezor from './LoginWithTrezor'

function mapDispatchToProps (dispatch) {
  return {
    navigateToCreateAccount: () => dispatch(navigateToCreateAccount()),
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    initAccountsSignature: () => dispatch(initAccountsSignature()),
  }
}

function mapStateToProps (state) {
  return {
    deviceList: state.get(DUCK_DEVICE_ACCOUNT).deviceList.map(
      (wallet) => new DeviceEntryModel({ ...wallet }),
    ),
  }
}

class LoginWithTrezorContainer extends PureComponent {
  static propTypes = {
    onDeviceSelect: PropTypes.func,
    deviceList: PropTypes.array,
    navigateToSelectImportMethod: PropTypes.func,
    navigateToCreateAccount: PropTypes.func,
    initAccountsSignature: PropTypes.func,
  }

  static defaultProps = {
    onDeviceSelect: () => {
    },
    deviceList: [],
  }

  componentDidMount () {
    this.props.initLedger()
  }

  render () {
    const {
      navigateToSelectImportMethod,
      navigateToCreateAccount,
      deviceList,
      onDeviceSelect,
    } = this.props

    return (
      <LoginWithTrezorContainer
        navigateToSelectImportMethod={navigateToSelectImportMethod}
        navigateToCreateAccount={navigateToCreateAccount}
        deviceList={deviceList}
        onDeviceSelect={onDeviceSelect}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginWithTrezorContainer)
