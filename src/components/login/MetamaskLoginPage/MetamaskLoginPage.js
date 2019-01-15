/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { WALLET_TYPE_METAMASK } from '@chronobank/core/models/constants/AccountEntryModel'
import {
  onCreateWalletFromDevice,
} from '@chronobank/login-ui/redux/thunks'
import {
  navigateToSelectWallet,
  navigateBack,
} from '@chronobank/login-ui/redux/navigation'
import {
  LoginWithMetamaskContainer,
  AccountNameContainer,
} from '@chronobank/login-ui/components'
import * as ProfileThunks from '@chronobank/core/redux/profile/thunks'
import { formatBlockchainListToArray, getAddress } from '@chronobank/core/redux/persistAccount/utils'
import BlockchainChoiceContainer from '@chronobank/login-ui/components/BlockchainChoice/BlockchainChoiceContainer'
import { METAMASK_ACTIVE_BLOCKCHAINS } from '@chronobank/core/redux/persistAccount/constants'

function mapDispatchToProps (dispatch) {
  return {
    getUserInfo: (addresses: string[]) => dispatch(ProfileThunks.getUserInfo(addresses)),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    onCreateWalletFromDevice: (name, device, profile, activeBlockchainList) => dispatch(onCreateWalletFromDevice(name, device, profile, WALLET_TYPE_METAMASK, activeBlockchainList)),
    navigateBack: () => dispatch(navigateBack()),
  }
}

class MetamaskLoginPage extends PureComponent {
  static PAGES = {
    DEVICE_SELECT_FORM: 1,
    ACCOUNT_NAME_FORM: 2,
    BLOCKCHAIN_CHOICE_FORM: 3,
  }

  static propTypes = {
    getUserInfo: PropTypes.func,
    navigateBack: PropTypes.func,
    onCreateWalletFromDevice: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      page: MetamaskLoginPage.PAGES.DEVICE_SELECT_FORM,
    }
  }

  getCurrentPage () {
    switch (this.state.page) {
    case MetamaskLoginPage.PAGES.DEVICE_SELECT_FORM:
      return (
        <LoginWithMetamaskContainer
          previousPage={this.previousPage.bind(this)}
          onDeviceSelect={this.onSubmitDevice.bind(this)}
        />
      )

    case MetamaskLoginPage.PAGES.ACCOUNT_NAME_FORM:
      return (
        <AccountNameContainer
          previousPage={this.previousPage.bind(this)}
          onSubmit={this.onSubmitAccountName.bind(this)}
        />
      )

    case MetamaskLoginPage.PAGES.BLOCKCHAIN_CHOICE_FORM:
      return (
        <BlockchainChoiceContainer
          previousPage={this.previousPage.bind(this)}
          onSubmitSuccess={this.onSubmitBlockchainChoiceFormSuccess.bind(this)}
          activeBlockchainList={METAMASK_ACTIVE_BLOCKCHAINS}
        />
      )

    default:
      return (
        <LoginWithMetamaskContainer
          previousPage={this.previousPage.bind(this)}
          onDeviceSelect={this.onSubmitDevice.bind(this)}
        />
      )
    }
  }

  async onSubmitDevice (device) {
    this.setState({
      device: device,
    })

    let response = null, userName = null, profile = null

    // If profile has been got && profile does exist && userName != null then create wallet
    try {
      response = await this.props.getUserInfo([getAddress(device.address, true)])

      profile = response.data[0]
      userName = profile.userName

      if (userName) {
        this.props.onCreateWalletFromDevice(userName, device, profile, METAMASK_ACTIVE_BLOCKCHAINS)
        this.props.navigateToSelectWallet()
      } else {
        this.setState({
          page: MetamaskLoginPage.PAGES.ACCOUNT_NAME_FORM,
        })
      }

    } catch (e) {
      this.setState({
        page: MetamaskLoginPage.PAGES.ACCOUNT_NAME_FORM,
      })
    }
  }

  async onSubmitAccountName (accountName) {
    this.setState({
      accountName,
      page: MetamaskLoginPage.PAGES.BLOCKCHAIN_CHOICE_FORM,
    })
  }

  async onSubmitBlockchainChoiceFormSuccess (blockchainListValues) {
    const { onCreateWalletFromDevice, navigateToSelectWallet } = this.props
    const { accountName, device } = this.state

    onCreateWalletFromDevice(
      accountName,
      device,
      null,
      formatBlockchainListToArray(blockchainListValues.toJS(), (name, isEnable) => isEnable),
    )
    navigateToSelectWallet()
  }

  navigateToDeviceSelectForm () {
    this.setState({
      page: MetamaskLoginPage.PAGES.DEVICE_SELECT_FORM,
    })
  }

  previousPage () {
    if (this.state.page === MetamaskLoginPage.PAGES.DEVICE_SELECT_FORM) {
      this.props.navigateBack()
    } else {
      this.setState({ page: this.state.page - 1 })
    }
  }

  render () {

    return this.getCurrentPage()
  }
}

export default connect(null, mapDispatchToProps)(MetamaskLoginPage)
