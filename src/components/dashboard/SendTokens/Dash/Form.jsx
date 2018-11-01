/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { FormControlLabel } from '@material-ui/core'
import { Checkbox } from 'redux-form-material-ui'
import {
  Field,
  formValueSelector,
  getFormSyncErrors,
  getFormValues,
  reduxForm,
} from 'redux-form/immutable'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import { walletInfoSelector } from '@chronobank/core/redux/wallet/selectors/selectors'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import { selectCurrentCoin } from '@chronobank/market/redux/selectors'
import { FORM_SEND_TOKENS } from 'components/constants'
import { estimateFee } from '@chronobank/core/redux/dash/thunks'
import AbstractBitcoinForm from '../AbstractBitcoin/Form'
import { prefix } from '../lang'
import validate from '../validate'

const mapStateToProps = (state, ownProps) => {
  const walletInfo = walletInfoSelector(ownProps.wallet, false, state)
  const selectedCurrency = selectCurrentCoin(state)
  const selector = formValueSelector(FORM_SEND_TOKENS)
  const formValues = getFormValues(FORM_SEND_TOKENS)
  const symbol = selector(state, 'symbol')
  const tokenId = walletInfo.tokens.some((token) => token.symbol === symbol) ? symbol : walletInfo.tokens[0].symbol
  const tokenInfo = walletInfo.tokens.find((token) => token.symbol === tokenId)
  const feeMultiplier = selector(state, 'feeMultiplier')
  const recipient = selector(state, 'recipient')
  const amount = selector(state, 'amount')
  const satPerByte = selector(state, 'satPerByte')
  const mode = selector(state, 'mode')
  const formErrors = getFormSyncErrors(FORM_SEND_TOKENS)(state)
  const token = state.get(DUCK_TOKENS).item(tokenId)

  return {
    selectedCurrency,
    tokens: state.get(DUCK_TOKENS),
    account: state.get(DUCK_SESSION).account,
    amount,
    token,
    tokenInfo,
    walletInfo,
    recipient,
    symbol,
    mode,
    formErrors,
    formValues: (formValues(state) && JSON.stringify(formValues(state).toJSON())) || null,
    feeMultiplier,
    satPerByte,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    estimateFee: (params) => dispatch(estimateFee(params)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_SEND_TOKENS, validate })
export default class DashForm extends AbstractBitcoinForm {
  renderExtraFields () {
    return (
      <FormControlLabel
        control={<Field component={Checkbox} name='instantSend' color='primary' />}
        label={I18n.t(`${prefix}.instantSend`)}
      />
    )
  }
}
