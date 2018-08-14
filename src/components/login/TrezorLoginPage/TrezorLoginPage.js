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
} from '@chronobank/login-ui/redux/actions'
import {
  LoginWithTrezorContainer,
  AccountNameContainer,
} from '@chronobank/login-ui/components'
import { SubmissionError } from 'redux-form'
import profileService from '@chronobank/login/network/ProfileService'
import { getAddress } from '@chronobank/core/redux/persistAccount/utils'

function mapDispatchToProps (dispatch) {
  return {
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    navigateToLoginPage: () => dispatch(navigateToLoginPage()),
    onCreateWalletFromDevice: (name, device, profile) => dispatch(onCreateWalletFromDevice(name, device, profile)),
    navigateBack: () => dispatch(navigateBack()),
  }
}

class TrezorLoginPage extends PureComponent {
  static PAGES = {
    DEVICE_SELECT_FORM: 1,
    ACCOUNT_NAME_FORM: 2,
  }

  static propTypes = {
    navigateToSelectWallet: PropTypes.func,
    navigateToSelectImportMethod: PropTypes.func,
    navigateToLoginPage: PropTypes.func,
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
          />
        )

      case TrezorLoginPage.PAGES.ACCOUNT_NAME_FORM:
        return (
          <AccountNameContainer
            previousPage={this.previousPage.bind(this)}
            onSubmit={this.onSubmitAccountName.bind(this)}
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
      response = await profileService.getPersonInfo([getAddress(device.address, true)])

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

  previousPage () {
    if (this.state.page === TrezorLoginPage.PAGES.WALLET_UPLOAD_FORM){
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
