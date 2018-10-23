/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ModalDialog from 'components/dialogs/ModalDialog'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LABOR_HOUR,
  BLOCKCHAIN_WAVES,
  BLOCKCHAIN_NEM,
} from '@chronobank/core/dao/constants'
import { BLOCKCHAIN_EOS } from '@chronobank/core/redux/eos/constants'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { MultisigEthWalletModel } from '@chronobank/core/models'
import Bitcoin from './Bitcoin/FormContainer'
import Dash from './Dash/FormContainer'
import Eos from './Eos/FormContainer'
import Ethereum from './Ethereum/FormContainer'
import LaborHour from './LaborHour/FormContainer'
import Nem from './Nem/FormContainer'
import Waves from './Waves/FormContainer'

function mapStateToProps (state, props) {
  const token = state.get(DUCK_TOKENS).item(props.tokenSymbol)

  return {
    token,
  }
}

@connect(mapStateToProps)
export default class SendTokens extends PureComponent {
  static propTypes = {
    wallet: PropTypes.oneOfType([PropTypes.instanceOf(WalletModel), PropTypes.instanceOf(MultisigEthWalletModel)]),
    isModal: PropTypes.bool,
    tokenSymbol: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
  }

  getFormName (blockchain: string) {
    switch (blockchain) {
      case BLOCKCHAIN_BITCOIN:
      case BLOCKCHAIN_BITCOIN_CASH:
      case BLOCKCHAIN_LITECOIN:
        return Bitcoin
      case BLOCKCHAIN_DASH:
        return Dash
      case BLOCKCHAIN_ETHEREUM:
        return Ethereum
      case BLOCKCHAIN_LABOR_HOUR:
        return LaborHour
      case BLOCKCHAIN_WAVES:
        return Waves
      case BLOCKCHAIN_NEM:
        return Nem
      case BLOCKCHAIN_EOS:
        return Eos
      default:
        return null
    }
  }

  renderSendTokensForm () {
    const { wallet } = this.props
    const SendTokenForm = this.getFormName(wallet.blockchain)

    return (
      <SendTokenForm
        {...this.props}
      />
    )
  }

  render () {
    const { isModal } = this.props

    if (isModal) {
      return (
        <ModalDialog>
          {this.renderSendTokensForm()}
        </ModalDialog>
      )
    }

    return this.renderSendTokensForm()
  }
}
