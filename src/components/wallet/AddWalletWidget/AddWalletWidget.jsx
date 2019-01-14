/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import { create2FAWallet, createWallet } from '@chronobank/core/redux/multisigWallet/actions'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { change, formValueSelector } from 'redux-form/immutable'
import { resetWalletsForm } from 'redux/ui/thunks'
import { navigateToWallets } from 'redux/ui/navigation'
import { FORM_ADD_NEW_WALLET } from '@chronobank/core/redux/wallets/constants'
import WidgetContainer from 'components/WidgetContainer/WidgetContainer'
import MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'
import { FORM_2FA_STEPS, FORM_2FA_WALLET } from '@chronobank/core/redux/multisigWallet/constants'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LABOR_HOUR,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_NEM,
  ETH,
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
import { estimateGas } from '@chronobank/core/redux/ethereum/thunks'
import { daoByType } from '@chronobank/core/redux/daos/selectors'
import { sectionsSelector } from '@chronobank/core/redux/wallets/selectors/wallets'
import MainWalletModel from '@chronobank/core/models/wallet/MainWalletModel'
import { walletBalanceSelector } from '@chronobank/core/redux/wallets/selectors/balances'

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_ADD_NEW_WALLET)
  const wallets = sectionsSelector(state)
  const wallet = wallets.find(wallet => wallet.title === BLOCKCHAIN_ETHEREUM)
  const walletId = `${wallet.title}-${wallet.address}`
  return {
    blockchain: selector(state, 'blockchain'),
    ethWalletType: selector(state, 'ethWalletType'),
    walletsManagerDAO: daoByType('WalletsManager')(state),
    ethBalance: walletBalanceSelector(walletId, BLOCKCHAIN_ETHEREUM)(state),
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
    estimateGas: (tx) => (
      dispatch(estimateGas(tx))),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AddWalletWidget extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    ethWalletType: PropTypes.string,
    ethBalance: PropTypes.number,
    selectWalletBlockchain: PropTypes.func,
    selectWalletType: PropTypes.func,
    reset: PropTypes.func,
    wallets: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        address: PropTypes.string,
        wallet: PropTypes.oneOfType([
          PropTypes.instanceOf(MainWalletModel),
          PropTypes.instanceOf(MultisigEthWalletModel),
        ]),
      }),
    ),
  }

  componentWillUnmount () {
    this.props.reset()
  }

  handleSubmitEthMultisig = async (values, dispatch, props) => {
  const wallet = this.createNewWallet(values, props)
    if(wallet){
      dispatch(createWallet(wallet))
      dispatch(navigateToWallets())
      dispatch(resetWalletsForm())
    }
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

  isHaveEthToCreate = async (values, props) => {
    const wallet = this.createNewWallet(values, props)
    if(wallet){
      const tx = this.props.walletsManagerDAO.createWallet(wallet)
      const { gasLimit, gasPrice } = await this.props.estimateGas(tx)
      const needAmount = gasLimit * gasPrice / 10 ** 18
      return this.props.ethBalance > needAmount
    }
   return false
  }

  createNewWallet = (values, props) => {
    if( !values ) return null
    const owners = values.get('owners')
    if( !owners ) return null
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

    return new MultisigEthWalletModel({
      ...props.initialValues.toJS(),
      ...values.toJS(),
      requiredSignatures: values.get('requiredSignatures').toString(),
      releaseTime,
      owners: ownersCollection,
      address: uuid(),
    })
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
        componentProps = { onSubmit: this.handleSubmitEthMultisig, isHaveEthToCreate: this.isHaveEthToCreate, balance: this.props.ethBalance }
        break
      case 'CW':
        title = `${prefix}.customWallet`
        Component = CustomWalletForm
        componentProps = { symbol: ETH, blockchain: BLOCKCHAIN_ETHEREUM }
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
        case BLOCKCHAIN_DASH:
        case BLOCKCHAIN_LABOR_HOUR:
        case BLOCKCHAIN_LITECOIN:
          return (
            <WidgetContainer title={`${prefix}.createWallet`} blockchain={blockchain}>
              <StandardWalletForm initialValues={{ blockchain }} />
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
