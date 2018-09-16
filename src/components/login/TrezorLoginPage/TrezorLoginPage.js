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
  navigateBack,
} from '@chronobank/login-ui/redux/navigation'
import { WALLET_TYPE_TREZOR } from '@chronobank/core/models/constants/AccountEntryModel'
import LoginWithTrezorContainer from '@chronobank/login-ui/components/LoginWithTrezor/LoginWithTrezorContainer'
import AccountNameContainer from '@chronobank/login-ui/components/AccountName/AccountNameContainer'
import DerivationPathFormContainer from '@chronobank/login-ui/components/DerivationPathForm/DerivationPathFormContainer'
import * as ProfileThunks from '@chronobank/core/redux/profile/thunks'
import { getAddress } from '@chronobank/core/redux/persistAccount/utils'

const mapDispatchToProps = (dispatch) => {
  return {
    getUserInfo: (addresses: string[]) => dispatch(ProfileThunks.getUserInfo(addresses)),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    onCreateWalletFromDevice: (name, device, profile) => dispatch(onCreateWalletFromDevice(name, device, profile, WALLET_TYPE_TREZOR)),
    navigateBack: () => dispatch(navigateBack()),
  }
}

@connect(null, mapDispatchToProps)
export default class TrezorLoginPage extends PureComponent {
  static PAGES = {
    DEVICE_SELECT_FORM: 1,
    ACCOUNT_NAME_FORM: 2,
    DERIVATION_PATH_FORM: 3,
  }

  static propTypes = {
    getUserInfo: PropTypes.func,
    navigateBack: PropTypes.func,
    onCreateWalletFromDevice: PropTypes.func,
    navigateToSelectWallet: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      page: TrezorLoginPage.PAGES.DEVICE_SELECT_FORM,
    }
  }

  getCurrentPage = () =>  {
    switch(this.state.page){
      case TrezorLoginPage.PAGES.DEVICE_SELECT_FORM:
        return (
          <LoginWithTrezorContainer
            previousPage={this.previousPage}
            onDeviceSelect={this.onSubmitDevice}
            navigateToDerivationPathForm={this.navigateToDerivationPathForm}
          />
        )

      case TrezorLoginPage.PAGES.ACCOUNT_NAME_FORM:
        return (
          <AccountNameContainer
            previousPage={this.previousPage}
            onSubmit={this.onSubmitAccountName}
          />
        )

      case TrezorLoginPage.PAGES.DERIVATION_PATH_FORM:
        return (
          <DerivationPathFormContainer
            previousPage={this.navigateToDeviceSelectForm}
            onSubmit={this.onSubmitDerivationPath}
          />
        )

      default:
        return (
          <LoginWithTrezorContainer
            previousPage={this.previousPage}
            onDeviceSelect={this.onSubmitDevice}
          />
        )
    }
  }

  onSubmitDevice = async (device) => {
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

  onSubmitAccountName = async (accountName) => {
    const { onCreateWalletFromDevice, navigateToSelectWallet } = this.props

    onCreateWalletFromDevice(accountName, this.state.device, null)
    navigateToSelectWallet()
  }

  onSubmitDerivationPath = async () => {
    this.setState({
      page: TrezorLoginPage.PAGES.DEVICE_SELECT_FORM,
    })
  }

  navigateToDerivationPathForm = () => {
    this.setState({
      page: TrezorLoginPage.PAGES.DERIVATION_PATH_FORM,
    })
  }

  navigateToDeviceSelectForm = () => {
    this.setState({
      page: TrezorLoginPage.PAGES.DEVICE_SELECT_FORM,
    })
  }

  previousPage = () => {
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
