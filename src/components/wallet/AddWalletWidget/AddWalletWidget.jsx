/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { change, formValueSelector } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { prefix } from './lang'

import './AddWalletWidget.scss'
import SelectWalletType from './SelectWalletType/SelectWalletType'
import SelectEthWallet from './SelectEthWallet/SelectEthWallet'
import MultisigWalletForm from './MultisigWalletForm/MultisigWalletForm'

export const FORM_ADD_NEW_WALLET = 'FormAddNewWallet'
const STEPS = {
  selectType: 'selectType',
  createWallet: 'createWallet',
  createMultisigEthWallet: 'createMultisigEthWallet',
}

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_ADD_NEW_WALLET)
  return {
    step: selector(state, 'step'),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    selectWalletBlockchain: (blockchain: string) => {
      dispatch(change(FORM_ADD_NEW_WALLET, 'step', STEPS.createWallet))
      dispatch(change(FORM_ADD_NEW_WALLET, 'blockchain', blockchain))
    },
    selectWalletType: (type: string) => {
      dispatch(change(FORM_ADD_NEW_WALLET, 'step', STEPS.createMultisigEthWallet))
      dispatch(change(FORM_ADD_NEW_WALLET, 'ethWalletType', type))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AddWalletWidget extends PureComponent {
  static propTypes = {
    step: PropTypes.string,
    selectWalletBlockchain: PropTypes.func,
    selectWalletType: PropTypes.func,
  }

  handleSelectWalletBlockchain = (blockchain: string) => {
    this.props.selectWalletBlockchain(blockchain)
  }

  handleSelectWalletType = (type: string) => {
    this.props.selectWalletType(type)
  }

  renderStep () {
    switch (this.props.step) {
      case STEPS.createWallet:
        return (
          <div styleName='widget'>
            <div styleName='title'><Translate value={`${prefix}.createWallet`} /></div>
            <div styleName='body'><SelectEthWallet handleTouchTap={this.handleSelectWalletType} /></div>
          </div>
        )
      case STEPS.createMultisigEthWallet:
        return (
          <div styleName='widget'>
            <div styleName='title'><Translate value={`${prefix}.multisignatureWallet`} /></div>
            <div styleName='body'><MultisigWalletForm /></div>
          </div>
        )
      case STEPS.selectType:
      default:
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
