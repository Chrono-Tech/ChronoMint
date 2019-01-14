/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import {
  initMetamaskPlugin,
} from '@chronobank/core/redux/device/actions'
import './LoginWithMetamask.scss'
import {
  navigateToCreateAccount,
} from '../../redux/navigation'
import LoginWithMetamask from './LoginWithMetamask'
import { deviceListSelector } from '@chronobank/core/redux/device/selectors'

function mapDispatchToProps (dispatch) {
  return {
    navigateToCreateAccount: () => dispatch(navigateToCreateAccount()),
    initMetamaskPlugin: () => dispatch(initMetamaskPlugin()),
  }
}

function mapStateToProps (state) {
  return {
    deviceList: deviceListSelector(state),
  }
}

class LoginWithMetamaskContainer extends PureComponent {
  static propTypes = {
    onDeviceSelect: PropTypes.func,
    deviceList: PropTypes.array,
    previousPage: PropTypes.func,
    navigateToCreateAccount: PropTypes.func,
    initMetamaskPlugin: PropTypes.func,
    navigateToDerivationPathForm: PropTypes.func,
  }

  static defaultProps = {
    onDeviceSelect: () => {
    },
    deviceList: [],
  }

  componentDidMount () {
    this.props.initMetamaskPlugin()
  }

  render () {
    const {
      navigateToCreateAccount,
      deviceList,
      onDeviceSelect,
      previousPage,
    } = this.props

    return (
      <LoginWithMetamask
        navigateToCreateAccount={navigateToCreateAccount}
        previousPage={previousPage}
        deviceList={deviceList}
        onDeviceSelect={onDeviceSelect}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginWithMetamaskContainer)
