/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Amount from '@chronobank/core/models/Amount'
import { TX_TRANSFER } from '@chronobank/core/dao/constants/ERC20DAO'

import { ACTION_APPROVE, ACTION_TRANSFER, FORM_SEND_TOKENS, MODE_ADVANCED, MODE_SIMPLE } from 'components/constants'
import { getSpendersAllowance } from '@chronobank/core/redux/mainWallet/actions'
import { walletInfoSelector } from '@chronobank/core/redux/wallet/selectors/selectors'
import { getMarket } from '@chronobank/core/redux/market/selectors'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import { change, Field, formPropTypes, formValueSelector, getFormSyncErrors, getFormValues, reduxForm } from 'redux-form/immutable'

export const handleNewProps = (currentFormValues, previousFormValues, ownProps) => async (dispatch, getState) => {
  const state = getState()
  console.log('handleNewProps: ', currentFormValues, previousFormValues, state)
  const walletInfo = walletInfoSelector(ownProps.wallet, false, state)
  const symbol = selector(state, 'symbol')
  const selector = formValueSelector(FORM_SEND_TOKENS)

  const tokenId = walletInfo.tokens.some((token) => token.symbol === symbol) ? symbol : walletInfo.tokens[0].symbol
  const tokenInfo = walletInfo.tokens.find((token) => token.symbol === tokenId)
  const feeMultiplier = selector(state, 'feeMultiplier')
  const recipient = selector(state, 'recipient')
  const amount = selector(state, 'amount')
  const gweiPerGas = selector(state, 'gweiPerGas')
  const gasLimit = selector(state, 'gasLimit')
  const mode = selector(state, 'mode')
  const formErrors = getFormSyncErrors(FORM_SEND_TOKENS)(state)
  const token = state.get(DUCK_TOKENS).item(tokenId)

  if ((currentFormValues.token.address() !== this.props.token.address() || currentFormValues.recipient !== this.props.recipient) && currentFormValues.token.isERC20()) {
    this.props.dispatch(getSpendersAllowance(currentFormValues.token.id(), currentFormValues.recipient))
  }

  if (currentFormValues.amount > 0 &&
    (currentFormValues.formValues !== this.props.formValues || currentFormValues.mode !== this.mode)) {
    const { token, recipient, amount, feeMultiplier, wallet } = currentFormValues
    try {
      const value = new Amount(token.addDecimals(amount), currentFormValues.symbol)
      this.handleEstimateGas(token.symbol(), [recipient, value, TX_TRANSFER], feeMultiplier, wallet.address)
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }

  if (currentFormValues.mode === MODE_SIMPLE && currentFormValues.feeMultiplier !== this.props.feeMultiplier) {
    this.props.dispatch(change(FORM_SEND_TOKENS, 'gweiPerGas', this.getFormFee(currentFormValues)))
  }
  if (currentFormValues.gasPriceMultiplier !== this.props.gasPriceMultiplier) {
    this.props.dispatch(change(FORM_SEND_TOKENS, 'feeMultiplier', currentFormValues.gasPriceMultiplier))
  }
  if (!this.props.gasLimit && this.state.gasLimit && this.props.gasLimit !== this.state.gasLimit) {
    this.props.dispatch(change(FORM_SEND_TOKENS, 'gasLimit', this.state.gasLimit))
  }
}

