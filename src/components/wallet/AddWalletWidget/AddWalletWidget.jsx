/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { change, formValueSelector } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { BLOCKCHAIN_BITCOIN, BLOCKCHAIN_LITECOIN } from '@chronobank/login/network/BitcoinProvider'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import { BLOCKCHAIN_NEM } from 'dao/NemDAO'
import { BLOCKCHAIN_WAVES } from 'dao/WavesDAO'
import WidgetContainer from 'components/WidgetContainer/WidgetContainer'
import { FORM_ADD_NEW_WALLET } from 'redux/mainWallet/actions'

import './AddWalletWidget.scss'
import SelectWalletType from './SelectWalletType/SelectWalletType'
import SelectEthWallet from './SelectEthWallet/SelectEthWallet'
import MultisigWalletForm from './MultisigWalletForm/MultisigWalletForm'
import TimeLockedWalletForm from './TimeLockedWalletForm/TimeLockedWalletForm'
import { prefix } from './lang'
import CustomWalletForm from './CustomWalletForm/CustomWalletForm'
import TwoFaWalletForm from '../TwoFaWalletForm/TwoFaWalletForm'

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_ADD_NEW_WALLET)
  return {
    blockchain: selector(state, 'blockchain'),
    ethWalletType: selector(state, 'ethWalletType'),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    selectWalletBlockchain: (blockchain: string) => {
      dispatch(change(FORM_ADD_NEW_WALLET, 'blockchain', blockchain))
    },
    selectWalletType: (type: string) => {
      dispatch(change(FORM_ADD_NEW_WALLET, 'ethWalletType', type))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AddWalletWidget extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    ethWalletType: PropTypes.string,
    selectWalletBlockchain: PropTypes.func,
    selectWalletType: PropTypes.func,
  }

  onSelectWalletBlockchain = (blockchain: string) => {
    this.props.selectWalletBlockchain(blockchain)
  }

  onSelectWalletType = (type: string) => {
    this.props.selectWalletType(type)
  }

  renderEthWalletForm (ethWalletType) {
    let title = null
    let Component = null
    switch (ethWalletType) {
      case 'MS':
        title = `${prefix}.multisignatureWallet`
        Component = MultisigWalletForm
        break
      case 'TL':
        title = `${prefix}.timeLockedWallet`
        Component = TimeLockedWalletForm
        break
      case 'CW':
        title = `${prefix}.customWallet`
        Component = CustomWalletForm
        break
      case '2FA':
        title = `${prefix}.twoFA`
        Component = TwoFaWalletForm
    }

    return (
      <WidgetContainer title={title}>
        <Component />
      </WidgetContainer>
    )
  }

  renderStep () {
    const { blockchain, ethWalletType } = this.props
    if (blockchain) {
      switch (blockchain) {
        case BLOCKCHAIN_BITCOIN:
        case BLOCKCHAIN_LITECOIN:
        case BLOCKCHAIN_NEM:
          return (
            <div>soon</div>
          )
        case BLOCKCHAIN_ETHEREUM:
          if (ethWalletType) {
            return this.renderEthWalletForm(ethWalletType)
          } else {
            return (
              <WidgetContainer title={`${prefix}.createWallet`}>
                <SelectEthWallet handleTouchTap={this.onSelectWalletType} />
              </WidgetContainer>
            )
          }
      }
    } else {
      return (
        <WidgetContainer title={`${prefix}.addWallet`}>
          <SelectWalletType handleTouchTap={this.onSelectWalletBlockchain} />
        </WidgetContainer>
      )
    }
  }

  render () {
    return (
      <div styleName='root'>
        {this.renderStep()}
      </div>
    )
  }
}
