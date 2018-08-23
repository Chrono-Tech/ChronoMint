/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  onCreateWalletFromDevice,
} from '@chronobank/login-ui/redux/thunks'
import {
  navigateToSelectWallet,
  navigateToSelectImportMethod,
  navigateToLoginPage,
  navigateBack,
} from '@chronobank/login-ui/redux/navigation'
import {
  LoginWithTrezorContainer,
  AccountNameContainer,
  DerivationPathFormContainer,
} from '@chronobank/login-ui/components'
import { SubmissionError } from 'redux-form'
import * as ProfileThunks from '@chronobank/core/redux/profile/thunks'
import { getAddress } from '@chronobank/core/redux/persistAccount/utils'

function mapDispatchToProps (dispatch) {
  return {
    getUserInfo: (addresses: string[]) => dispatch(ProfileThunks.getUserInfo(addresses)),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    onCreateWalletFromDevice: (name, device, profile) => dispatch(onCreateWalletFromDevice(name, device, profile)),
    navigateBack: () => dispatch(navigateBack()),
  }
}

class TrezorLoginPage extends PureComponent {
  static PAGES = {
    DEVICE_SELECT_FORM: 1,
    ACCOUNT_NAME_FORM: 2,
    DERIVATION_PATH_FORM: 3,
  }

  static propTypes = {
    getUserInfo: PropTypes.func,
    navigateBack: PropTypes.func,
    onCreateWalletFromDevice: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      page: TrezorLoginPage.PAGES.DEVICE_SELECT_FORM,
      walletJSON: null,
    }
  }

  getCurrentPage () {
    switch(this.state.page){
      case TrezorLoginPage.PAGES.DEVICE_SELECT_FORM:
        return (
          <LoginWithTrezorContainer
            previousPage={this.previousPage.bind(this)}
            onDeviceSelect={this.onSubmitDevice.bind(this)}
            navigateToDerivationPathForm={this.navigateToDerivationPathForm.bind(this)}
          />
        )

      case TrezorLoginPage.PAGES.ACCOUNT_NAME_FORM:
        return (
          <AccountNameContainer
            previousPage={this.previousPage.bind(this)}
            onSubmit={this.onSubmitAccountName.bind(this)}
          />
        )

      case TrezorLoginPage.PAGES.DERIVATION_PATH_FORM:
        return (
          <DerivationPathFormContainer
            previousPage={this.navigateToDeviceSelectForm.bind(this)}
            onSubmit={this.onSubmitDerivationPath.bind(this)}
          />
        )

      default:
        return (
          <LoginWithTrezorContainer
            previousPage={this.previousPage.bind(this)}
            onDeviceSelect={this.onSubmitDevice.bind(this)}
          />
        )
    }
  }

  async onSubmitDevice (device) {
    console.log('submit device')
    console.log(device)
    this.setState({
	    device: device
    })

    let response = null, userName = null, profile = null

    // If profile has been got && profile does exist && userName != null then create wallet
    try {
      response = await this.props.getUserInfo([getAddress(device.address, true)])

      profile = response.data[0]
      userName = profile.userName

      if (userName){
        this.props.onCreateWalletFromDevice(userName, device, profile)
        this.props.navigateToSelectWallet()
      } else {
        this.setState({
          page: TrezorLoginPage.PAGES.ACCOUNT_NAME_FORM,
        })
      }

    } catch (e) {
      this.setState({
        page: TrezorLoginPage.PAGES.ACCOUNT_NAME_FORM,
      })
    }
  }

  async onSubmitAccountName (accountName) {
    const { onCreateWalletFromDevice, navigateToSelectWallet } = this.props

    onCreateWalletFromDevice(accountName, this.state.device, null)
    navigateToSelectWallet()
  }

  async onSubmitDerivationPath ({ path }) {
    console.log('path', path)
    this.setState({
      page: TrezorLoginPage.PAGES.DEVICE_SELECT_FORM
    })
  }

  navigateToDerivationPathForm () {
    this.setState({
      page: TrezorLoginPage.PAGES.DERIVATION_PATH_FORM,
    })
  }

  navigateToDeviceSelectForm () {
    this.setState({
      page: TrezorLoginPage.PAGES.DEVICE_SELECT_FORM,
    })
  }

  previousPage () {
    if (this.state.page === TrezorLoginPage.PAGES.DEVICE_SELECT_FORM){
      this.props.navigateBack()
    } else {
      this.setState ({ page: this.state.page - 1 })
    }
  }

  render () {

    return this.getCurrentPage()
  }
}

export default connect(null, mapDispatchToProps)(TrezorLoginPage)
