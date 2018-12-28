/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import BigNumber from 'bignumber.js'

import { connect } from 'react-redux'
import { DECIMALS_ETHEREUM } from '@chronobank/core/dao/constants'
import DeviceEntryModel from '@chronobank/core/models/device/DeviceEntryModel'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'

import './LoginWithLedger.scss'

function mapStateToProps (state) {
  const session = state.get(DUCK_SESSION)
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)

  return {
    selectedNetworkId,
    selectedProviderId,
    web3: session.web3,
  }
}

@connect(mapStateToProps, null)
class LedgerAddress extends Component {
  static propTypes = {
    entryModel: PropTypes.instanceOf(DeviceEntryModel),
    onDeviceSelect: PropTypes.func,
    selectedNetworkId: PropTypes.number,
    selectedProviderId: PropTypes.number,
  }

  constructor () {
    super()

    this.state = {
      balance: null,
      isLoading: true,
    }
  }

  componentDidMount () {
    const { web3, entryModel } = this.props
    if (!web3) {
      return
    }

    this.updateBalance(entryModel.address)
  }

  componentDidUpdate (prevProps) {
    const { selectedNetworkId, entryModel } = this.props

    if (prevProps.selectedNetworkId !== selectedNetworkId) {
      this.updateBalance(entryModel.address)
    }
  }

  updateBalance (address) {
    this.setState({
      isLoading: true,
    })

    this.props.web3.eth.getBalance(address)
      .then((balance) => {
        const balanceBN = new BigNumber(balance)
        this.setState({
          balance: balanceBN.div(Math.pow(10, DECIMALS_ETHEREUM)),
          isLoading: false,
        })
      })
      .catch((error) => {
        //eslint-disable-next-line
        console.error('Getting balances ethereum: ', error)
      })

  }

  render () {
    const { entryModel, onDeviceSelect } = this.props
    const { isLoading, balance } = this.state

    return (
      <div
        onClick={() => onDeviceSelect(entryModel)}
        styleName='account-item'
      >
        <div styleName='account-item-content'>
          <div styleName='account-item-address'>
            { entryModel.address }
          </div>
          <div styleName='account-item-additional'>
            { isLoading && 'Loading' }
            { !isLoading && `${integerWithDelimiter(balance, true)} ETH` }
          </div>
        </div>
        <div styleName='account-item-icon'>
          <div className='chronobank-icon'>next</div>
        </div>
      </div>
    )
  }
}

export default LedgerAddress
