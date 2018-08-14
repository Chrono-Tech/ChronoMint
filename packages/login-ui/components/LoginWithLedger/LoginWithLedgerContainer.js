/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import {
  DUCK_DEVICE_ACCOUNT,
} from '@chronobank/core/redux/device/constants'
import {
  initLedgerDevice,
} from '@chronobank/core/redux/device/actions'
import { DeviceEntryModel } from '@chronobank/core/models'
import './LoginWithLedger.scss'
import {
  navigateToSelectImportMethod,
  navigateToCreateAccount,
} from '../../redux/actions'
import LoginWithLedger from './LoginWithLedger'

function mapDispatchToProps (dispatch) {
  return {
    navigateToCreateAccount: () => dispatch(navigateToCreateAccount()),
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    initLedgerDevice: () => dispatch(initLedgerDevice()),
  }
}

function mapStateToProps (state) {
  return {
    deviceList: state.get(DUCK_DEVICE_ACCOUNT).deviceList.map(
      (wallet) => new DeviceEntryModel({ ...wallet }),
    ),
  }
}

class LoginWithLedgerContainer extends PureComponent {
  static propTypes = {
    onDeviceSelect: PropTypes.func,
    deviceList: PropTypes.array,
    navigateToSelectImportMethod: PropTypes.func,
    navigateToCreateAccount: PropTypes.func,
    initLedgerDevice: PropTypes.func,
  }

  static defaultProps = {
    onDeviceSelect: () => {
    },
    deviceList: [],
  }

  componentDidMount () {
    this.props.initLedgerDevice()
  }

  render () {
    const {
      navigateToSelectImportMethod,
      navigateToCreateAccount,
      deviceList,
      onDeviceSelect,
    } = this.props

    return (
      <LoginWithLedger
        navigateToSelectImportMethod={navigateToSelectImportMethod}
        navigateToCreateAccount={navigateToCreateAccount}
        deviceList={deviceList}
        onDeviceSelect={onDeviceSelect}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginWithLedgerContainer)
