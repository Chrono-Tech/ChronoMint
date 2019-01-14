/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { DUCK_DEVICE_ACCOUNT } from '@chronobank/core/redux/device/constants'
import { initTrezorDevice } from '@chronobank/core/redux/device/thunks'
import { DeviceEntryModel } from '@chronobank/core/models'
import './LoginWithTrezor.scss'
import { navigateToCreateAccount } from '../../redux/navigation'
import LoginWithTrezor from './LoginWithTrezor'

function mapDispatchToProps (dispatch) {
  return {
    navigateToCreateAccount: () => dispatch(navigateToCreateAccount()),
    initTrezorDevice: () => dispatch(initTrezorDevice()),
  }
}

function mapStateToProps (state) {
  const deviceAccount = state.get(DUCK_DEVICE_ACCOUNT)
  const deviceList = state.get(DUCK_DEVICE_ACCOUNT).deviceList

  return {
    deviceList: Array.isArray(deviceList) ? deviceList.map(
      (wallet) => new DeviceEntryModel({ ...wallet }),
    ) : [],
    deviceState: deviceAccount.status,
  }
}

class LoginWithTrezorContainer extends PureComponent {
  static propTypes = {
    onDeviceSelect: PropTypes.func,
    deviceList: PropTypes.array,
    deviceState: PropTypes.string,
    previousPage: PropTypes.func,
    navigateToCreateAccount: PropTypes.func,
    initTrezorDevice: PropTypes.func,
    navigateToDerivationPathForm: PropTypes.func,
  }

  static defaultProps = {
    onDeviceSelect: () => {},
    deviceList: [],
  }

  async componentDidMount () {
    await this.props.initTrezorDevice()
  }

  render () {
    const {
      navigateToCreateAccount,
      deviceList,
      onDeviceSelect,
      navigateToDerivationPathForm,
      previousPage,
      deviceState,
    } = this.props

    return (
      <LoginWithTrezor
        navigateToCreateAccount={navigateToCreateAccount}
        previousPage={previousPage}
        deviceList={deviceList}
        deviceState={deviceState}
        onDeviceSelect={onDeviceSelect}
        navigateToDerivationPathForm={navigateToDerivationPathForm}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginWithTrezorContainer)
