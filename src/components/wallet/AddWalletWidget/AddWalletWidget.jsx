/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import { create2FAWallet, createWallet } from '@chronobank/core/redux/multisigWallet/actions'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { change, formValueSelector } from 'redux-form/immutable'
import { goToWallets, resetWalletsForm } from '@chronobank/core/redux/mainWallet/actions'
import { FORM_ADD_NEW_WALLET } from '@chronobank/core/redux/mainWallet/constants'
import WidgetContainer from 'components/WidgetContainer/WidgetContainer'
import MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'
import { FORM_2FA_STEPS, FORM_2FA_WALLET } from '@chronobank/core/redux/multisigWallet/constants'
import {
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_ETHEREUM,
} from '@chronobank/core/dao/constants'
import './AddWalletWidget.scss'
import SelectWalletType from './SelectWalletType/SelectWalletType'
import SelectEthWallet from './SelectEthWallet/SelectEthWallet'
import MultisigWalletForm from './MultisigWalletForm/MultisigWalletForm'
import TimeLockedWalletForm from './TimeLockedWalletForm/TimeLockedWalletForm'
import { prefix } from './lang'
import CustomWalletForm from './CustomWalletForm/CustomWalletForm'
import TwoFaWalletForm from '../TwoFaWalletForm/TwoFaWalletForm'
import StandardWalletForm from './StandardWalletForm/StandardWalletForm'

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
    reset: () => dispatch(resetWalletsForm()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AddWalletWidget extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    ethWalletType: PropTypes.string,
    selectWalletBlockchain: PropTypes.func,
    selectWalletType: PropTypes.func,
    reset: PropTypes.func,
  }

  componentWillUnmount () {
    this.props.reset()
  }

  handleSubmitEthMultisig = (values, dispatch, props) => {
    // owners
    const owners = values.get('owners')
    let ownersCollection = []
    ownersCollection.push(props.account)
    owners.forEach(({ address }) => {
      ownersCollection.push(address)
    })

    // date
    let releaseTime = new Date(0)
    const isTimeLocked = values.get('isTimeLocked')
    if (isTimeLocked) {
      const date = values.get('timeLockDate')
      const time = values.get('timeLockTime')
      releaseTime = new Date(date.setHours(
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds(),
      ))
    }

    const wallet = new MultisigEthWalletModel({
      ...props.initialValues.toJS(),
      ...values.toJS(),
      requiredSignatures: values.get('requiredSignatures').toString(),
      releaseTime,
      owners: ownersCollection,
      address: uuid(),
    })

    dispatch(createWallet(wallet))
    dispatch(goToWallets())
    dispatch(resetWalletsForm())
  }

  handleSubmitEth2FA = (values, dispatch, props) => {
    // owners
    const owners = values.get('owners')
    let ownersCollection = []
    ownersCollection.push(props.account)
    owners.forEach(({ address }) => {
      ownersCollection.push(address)
    })

    // date
    let releaseTime = new Date(0)

    const wallet = new MultisigEthWalletModel({
      ...props.initialValues.toJS(),
      ...values.toJS(),
      releaseTime,
      is2FA: true,
      owners: ownersCollection,
    })

    dispatch(create2FAWallet(wallet, values.get('feeMultiplier')))
    dispatch(change(FORM_2FA_WALLET, 'step', FORM_2FA_STEPS[1]))
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
    let componentProps = {}
    switch (ethWalletType) {
      case 'ST':
        title = `${prefix}.createWallet`
        Component = StandardWalletForm
        componentProps = { initialValues: { blockchain: BLOCKCHAIN_ETHEREUM } }
        break
      case 'MS':
        title = `${prefix}.multisignatureWallet`
        Component = MultisigWalletForm
        componentProps = { onSubmit: this.handleSubmitEthMultisig }
        break
      case 'TL':
        title = `${prefix}.timeLockedWallet`
        Component = TimeLockedWalletForm
        componentProps = { onSubmit: this.handleSubmitEthMultisig }
        break
      case 'CW':
        title = `${prefix}.customWallet`
        Component = CustomWalletForm
        break
      case '2FA':
        title = `${prefix}.twoFA`
        Component = TwoFaWalletForm
        componentProps = { onSubmit: this.handleSubmitEth2FA }
    }

    return (
      <WidgetContainer title={title} blockchain={BLOCKCHAIN_ETHEREUM}>
        <Component {...componentProps} />
      </WidgetContainer>
    )
  }

  renderStep () {
    const { blockchain, ethWalletType } = this.props
    if (blockchain) {
      switch (blockchain) {
        case BLOCKCHAIN_BITCOIN:
          return (
            <WidgetContainer title={`${prefix}.createWallet`} blockchain={BLOCKCHAIN_BITCOIN}>
              <StandardWalletForm initialValues={{ blockchain: BLOCKCHAIN_BITCOIN }} />
            </WidgetContainer>
          )
        case BLOCKCHAIN_LITECOIN:
          return (
            <WidgetContainer title={`${prefix}.createWallet`} blockchain={BLOCKCHAIN_LITECOIN}>
              <StandardWalletForm initialValues={{ blockchain: BLOCKCHAIN_LITECOIN }} />
            </WidgetContainer>
          )
        case BLOCKCHAIN_NEM:
          return (
            <div>soon</div>
          )
        case BLOCKCHAIN_ETHEREUM:
          if (ethWalletType) {
            return this.renderEthWalletForm(ethWalletType)
          } else {
            return (
              <WidgetContainer title={`${prefix}.createWallet`} blockchain={BLOCKCHAIN_ETHEREUM}>
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
