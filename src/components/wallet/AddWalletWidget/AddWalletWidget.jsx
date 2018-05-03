/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { change, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import MultisigWalletForm from 'dialogs/wallet/MultisigWalletForm/MultisigWalletForm'
import { Translate } from 'react-redux-i18n'
import { prefix } from './lang'

import './AddWalletWidget.scss'
import SelectWalletType from './SelectWalletType/SelectWalletType'
import SelectEthWallet from './SelectEthWallet/SelectEthWallet'

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
    initialValues: {
      step: STEPS.selectType,
    },
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_ADD_NEW_WALLET })
export default class AddWalletWidget extends PureComponent {
  static propTypes = {
    step: PropTypes.string,
    dispatch: PropTypes.func,
    ...formPropTypes,
  }

  selectWalletBlockchain = (blockchain: string) => {
    this.props.dispatch(change(FORM_ADD_NEW_WALLET, 'step', STEPS.createWallet))
    this.props.dispatch(change(FORM_ADD_NEW_WALLET, 'blockchain', blockchain))
  }

  selectWalletType = (type: string) => {
    this.props.dispatch(change(FORM_ADD_NEW_WALLET, 'step', STEPS.createMultisigEthWallet))
    this.props.dispatch(change(FORM_ADD_NEW_WALLET, 'ethWalletType', type))
  }

  renderStep () {
    switch (this.props.step) {
      case STEPS.selectType:
        return (
          <div styleName='widget'>
            <div styleName='title'><Translate value={`${prefix}.addWallet`} /></div>
            <div styleName='body'><SelectWalletType handleTouchTap={this.selectWalletBlockchain} /></div>
          </div>
        )
      case STEPS.createWallet:
        return (
          <div styleName='widget'>
            <div styleName='title'><Translate value={`${prefix}.createWallet`} /></div>
            <div styleName='body'><SelectEthWallet handleTouchTap={this.selectWalletType} /></div>
          </div>
        )
      case STEPS.createMultisigEthWallet:
        return (
          <div styleName='widget'>
            <div styleName='title'><Translate value={`${prefix}.multisignatureWallet`} /></div>
            <div styleName='body'><MultisigWalletForm /></div>
          </div>
        )
      default:
        return <div>select wallet</div>
    }
  }

  render () {
    return (
      <form styleName='root'>
        {this.renderStep()}
      </form>
    )
  }
}
