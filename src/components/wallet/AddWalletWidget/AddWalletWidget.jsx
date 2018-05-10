/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { change, formValueSelector } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { BLOCKCHAIN_BITCOIN, BLOCKCHAIN_LITECOIN } from '@chronobank/login/network/BitcoinProvider'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import { BLOCKCHAIN_NEM } from 'dao/NemDAO'
import { FORM_ADD_NEW_WALLET } from 'redux/mainWallet/actions'

import './AddWalletWidget.scss'
import SelectWalletType from './SelectWalletType/SelectWalletType'
import SelectEthWallet from './SelectEthWallet/SelectEthWallet'
import MultisigWalletForm from './MultisigWalletForm/MultisigWalletForm'
import TimeLockedWalletForm from './TimeLockedWalletForm/TimeLockedWalletForm'
import { prefix } from './lang'
import CustomWalletForm from './CustomWalletForm/CustomWalletForm'

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

  handleSelectWalletBlockchain = (blockchain: string) => {
    this.props.selectWalletBlockchain(blockchain)
  }

  handleSelectWalletType = (type: string) => {
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
    }

    return (
      <div styleName='widget'>
        <div styleName='title'><Translate value={title} /></div>
        <div styleName='body'>
          <Component />
        </div>
      </div>
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
              <div styleName='widget'>
                <div styleName='title'><Translate value={`${prefix}.createWallet`} /></div>
                <div styleName='body'><SelectEthWallet handleTouchTap={this.handleSelectWalletType} /></div>
              </div>
            )
          }
      }
    } else {
      return (
        <div styleName='widget'>
          <div styleName='title'><Translate value={`${prefix}.addWallet`} /></div>
          <div styleName='body'><SelectWalletType handleTouchTap={this.handleSelectWalletBlockchain} /></div>
        </div>
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
