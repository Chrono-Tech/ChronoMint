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
  initTrezorDevice,
} from '@chronobank/core/redux/device/actions'
import { DeviceEntryModel } from '@chronobank/core/models'
import './LoginWithTrezor.scss'
import {
  navigateToCreateAccount,
  navigateToSelectWallet,
} from '../../redux/actions'
import LoginWithTrezor from './LoginWithTrezor'

function mapDispatchToProps (dispatch) {
  return {
    navigateToCreateAccount: () => dispatch(navigateToCreateAccount()),
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    initTrezorDevice: () => dispatch(initTrezorDevice()),
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
    previousPage: PropTypes.func,
    navigateToCreateAccount: PropTypes.func,
    initTrezorDevice: PropTypes.func,
    navigateToDerivationPathForm: PropTypes.func,
  }

  static defaultProps = {
    onDeviceSelect: () => {
    },
    deviceList: [],
  }

  componentDidMount () {
    this.props.initTrezorDevice()
  }

  render () {
    const {
      navigateToCreateAccount,
      deviceList,
      onDeviceSelect,
      navigateToDerivationPathForm,
      previousPage,
    } = this.props

    return (
      <LoginWithTrezor
        navigateToCreateAccount={navigateToCreateAccount}
        previousPage={previousPage}
        deviceList={deviceList}
        onDeviceSelect={onDeviceSelect}
        navigateToDerivationPathForm={navigateToDerivationPathForm}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginWithTrezorContainer)
