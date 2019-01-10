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
  navigateToCreateAccount,
} from '../../redux/navigation'
import LoginWithLedger from './LoginWithLedger'

function mapDispatchToProps (dispatch) {
  return {
    navigateToCreateAccount: () => dispatch(navigateToCreateAccount()),
    initLedgerDevice: () => dispatch(initLedgerDevice()),
  }
}

function mapStateToProps (state) {
  const deviceAccount = state.get(DUCK_DEVICE_ACCOUNT)
  const deviceList = state.get(DUCK_DEVICE_ACCOUNT).deviceList
  console.log('DUCK_DEVICE_ACCOUNT: ', deviceAccount )

  return {
    deviceList: Array.isArray(deviceList) ? deviceList.map(
      (wallet) => new DeviceEntryModel({ ...wallet }),
    ) : [],
    deviceState: deviceAccount.status,
  }
}

class LoginWithLedgerContainer extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func,
    onDeviceSelect: PropTypes.func,
    deviceList: PropTypes.array,
    deviceState: PropTypes.string,
    navigateToCreateAccount: PropTypes.func,
    initLedgerDevice: PropTypes.func,
    navigateToDerivationPathForm: PropTypes.func,
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
      previousPage,
      navigateToCreateAccount,
      deviceList,
      deviceState,
      onDeviceSelect,
      navigateToDerivationPathForm,
    } = this.props

    return (
      <LoginWithLedger
        navigateToCreateAccount={navigateToCreateAccount}
        deviceList={deviceList}
        deviceState={deviceState}
        previousPage={previousPage}
        onDeviceSelect={onDeviceSelect}
        navigateToDerivationPathForm={navigateToDerivationPathForm}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginWithLedgerContainer)
