/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { isTestingNetwork } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DUCK_WALLET } from 'redux/wallet/actions'

import './WalletContent.scss'
import WalletWidgetDetail from '../../../components/wallet/WalletWidgetDetail/WalletWidgetDetail'

function mapStateToProps (state) {
  const network = state.get(DUCK_NETWORK)

  return {
    ...state.get(DUCK_WALLET),
    selectedNetworkId: network.selectedNetworkId,
    selectedProviderId: network.selectedProviderId,
    isTesting: isTestingNetwork(network.selectedNetworkId, network.selectedProviderId),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    goToWallets: () => dispatch(push('/wallets')),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletContent extends Component {
  static propTypes = {
    isMultisig: PropTypes.bool,
    isTesting: PropTypes.bool,
    selectedNetworkId: PropTypes.number,
    selectedProviderId: PropTypes.number,
    blockchain: PropTypes.string,
    address: PropTypes.string,
    goToWallets: PropTypes.func,
  }

  constructor (props) {
    super(props)

    if (!props.blockchain || !props.address) {
      props.goToWallets()
    }
  }

  render () {
    const { blockchain, address } = this.props

    return (
      <div styleName='root'>
        <WalletWidgetDetail blockchain={blockchain} address={address} />
      </div>
    )
  }
}
