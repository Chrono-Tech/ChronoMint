/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Amount from '@chronobank/core/models/Amount'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { change } from 'redux-form'
import { depositAsset, initAssetsHolder, withdrawAsset } from '@chronobank/core/redux/assetsHolder/actions'
import { modalsClose } from 'redux/modals/actions'
import { mainApprove } from '@chronobank/core/redux/mainWallet/actions'
import { ModalDialog } from 'components'
import {
  ACTION_APPROVE,
  ACTION_DEPOSIT,
  ACTION_WITHDRAW,
  FORM_DEPOSIT_TOKENS,
} from 'components/constants'
import DepositTokensForm from './DepositTokensForm'
import './DepositTokensForm.scss'

function mapDispatchToProps (dispatch) {
  return {
    initAssetsHolder: () => dispatch(initAssetsHolder()),
    mainApprove: (token, amount, spender, feeMultiplier, advancedOptions = undefined) => dispatch(mainApprove(token, amount, spender, feeMultiplier, advancedOptions)),
    depositAsset: (amount, token, feeMultiplier, advancedOptions = undefined) => dispatch(depositAsset(amount, token, feeMultiplier, advancedOptions)),
    withdrawAsset: (amount, token, feeMultiplier, advancedOptions = undefined) => dispatch(withdrawAsset(amount, token, feeMultiplier, advancedOptions)),
    resetForm: () => dispatch(change(FORM_DEPOSIT_TOKENS, 'amount', '')),
    handleCloseModal: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class DepositTokensModal extends PureComponent {
  static propTypes = {
    initAssetsHolder: PropTypes.func,
    mainApprove: PropTypes.func,
    depositAsset: PropTypes.func,
    withdrawAsset: PropTypes.func,
    resetForm: PropTypes.func,
    handleCloseModal: PropTypes.func,
    isWithdraw: PropTypes.bool,
  }

  componentWillMount () {
    this.props.initAssetsHolder()
  }

  handleSubmit = (values) => {
    const token = values.get('token')
    const amount = new Amount(token.addDecimals(values.get('amount')), token.id())
    const feeMultiplier = values.get('feeMultiplier') || 1

    switch (values.get('action')) {
      case ACTION_APPROVE:
        this.props.mainApprove(token, amount, values.get('spender'), feeMultiplier, {
          skipSlider: true,
        })
        break
      case ACTION_DEPOSIT:
        this.props.depositAsset(amount, token, feeMultiplier, {
          skipSlider: true,
        })
        break
      case ACTION_WITHDRAW:
        this.props.withdrawAsset(amount, token, feeMultiplier, {
          skipSlider: true,
        })
        break
    }
  }

  handleSubmitSuccess = () => {
    this.props.handleCloseModal()
  }

  render () {
    return (
      <ModalDialog>
        <DepositTokensForm
          isWithdraw={this.props.isWithdraw}
          onSubmit={this.handleSubmit}
          onSubmitSuccess={this.handleSubmitSuccess}
          onCloseModal={this.props.handleCloseModal}
        />
      </ModalDialog>
    )
  }
}
