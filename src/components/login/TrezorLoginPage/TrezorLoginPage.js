/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { onCreateWalletFromDevice } from '@chronobank/login-ui/redux/thunks'
import {
  navigateToSelectWallet,
  navigateBack,
} from '@chronobank/login-ui/redux/navigation'
import { WALLET_TYPE_TREZOR } from '@chronobank/core/models/constants/AccountEntryModel'
import { TREZOR_ACTIVE_BLOCKCHAINS } from '@chronobank/core/redux/persistAccount/constants'
import LoginWithTrezorContainer from '@chronobank/login-ui/components/LoginWithTrezor/LoginWithTrezorContainer'
import BlockchainChoiceContainer from '@chronobank/login-ui/components/BlockchainChoice/BlockchainChoiceContainer'
import AccountNameContainer from '@chronobank/login-ui/components/AccountName/AccountNameContainer'
import DerivationPathFormContainer from '@chronobank/login-ui/components/DerivationPathForm/DerivationPathFormContainer'
import * as ProfileThunks from '@chronobank/core/redux/profile/thunks'
import { formatBlockchainListToArray, getAddress } from '@chronobank/core/redux/persistAccount/utils'

function mapDispatchToProps (dispatch) {
  return {
    getUserInfo: (addresses: string[]) => dispatch(ProfileThunks.getUserInfo(addresses)),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    onCreateWalletFromDevice: (name, device, profile, blockchainList) => {
      dispatch(onCreateWalletFromDevice(name, device, profile, WALLET_TYPE_TREZOR, blockchainList))
    },
    navigateBack : () => dispatch(navigateBack()),
  }
}

class TrezorLoginPage extends PureComponent {
  static PAGES = {
    DEVICE_SELECT_FORM: 1,
    ACCOUNT_NAME_FORM: 2,
    BLOCKCHAIN_CHOICE_FORM: 3,
    DERIVATION_PATH_FORM: 4,
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

      case TrezorLoginPage.PAGES.BLOCKCHAIN_CHOICE_FORM:
        return (
          <BlockchainChoiceContainer
            previousPage={this.previousPage.bind(this)}
            onSubmitSuccess={this.onSubmitBlockchainChoiceFormSuccess.bind(this)}
            activeBlockchainList={TREZOR_ACTIVE_BLOCKCHAINS}
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

  async onSubmitBlockchainChoiceFormSuccess (blockchainListValues) {
    const { onCreateWalletFromDevice, navigateToSelectWallet } = this.props
    const { accountName, device } = this.state

    onCreateWalletFromDevice(
      accountName,
      device,
      null,
      formatBlockchainListToArray(blockchainListValues.toJS(), (name, isEnable) => isEnable)
    )
    navigateToSelectWallet()
  }

  async onSubmitDevice (device) {
    this.setState({
      device,
    })

    let response = null, userName = null, profile = null

    // If profile has been got && profile does exist && userName != null then create wallet
    try {
      response = await this.props.getUserInfo([getAddress(device.address, true)])
      profile = response.data && response.data[0]
      userName = profile.userName

      if (userName){
        this.setState({
          accountName: userName,
          page: TrezorLoginPage.PAGES.BLOCKCHAIN_CHOICE_FORM,
        })
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
    this.setState({
      accountName,
      page: TrezorLoginPage.PAGES.BLOCKCHAIN_CHOICE_FORM,
    })
  }

  async onSubmitDerivationPath () {
    this.setState({
      page: TrezorLoginPage.PAGES.DEVICE_SELECT_FORM,
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
