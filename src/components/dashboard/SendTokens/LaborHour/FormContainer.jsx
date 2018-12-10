/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { connect } from 'react-redux'
import { LHT } from '@chronobank/core/dao/constants'
import { estimateLaborHourGasTransfer } from '@chronobank/core/redux/tokens/thunks'
import { formValueSelector, getFormSyncErrors, getFormValues } from 'redux-form/immutable'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import { getGasPriceMultiplier } from '@chronobank/core/redux/session/selectors'
import { walletInfoSelector } from '@chronobank/core/redux/wallet/selectors/selectors'
import { selectCurrentCurrency } from '@chronobank/market/redux/selectors'
import { getLXTokens } from '@chronobank/core/redux/laborHour/selectors/mainSelectors'
import { FORM_SEND_TOKENS } from 'components/constants'
import '../form.scss'
import Form from '../AbstractEthereum/Form'
import FormContainer, { mapDispatchToProps, mapStateToProps as mapContainerStateToProps } from '../AbstractEthereum/FormContainer'

const mapFormStateToProps = (state, ownProps) => {
  const walletInfo = walletInfoSelector(ownProps.wallet, false, state)
  const selectedCurrency = selectCurrentCurrency(state)
  const selector = formValueSelector(FORM_SEND_TOKENS)
  const formValues = getFormValues(FORM_SEND_TOKENS)
  const symbol = selector(state, 'symbol')
  const tokenId = walletInfo.tokens.some((token) => token.symbol === symbol) ? symbol : walletInfo.tokens[0].symbol
  const tokenInfo = walletInfo.tokens.find((token) => token.symbol === tokenId)
  const feeMultiplier = selector(state, 'feeMultiplier')
  const recipient = selector(state, 'recipient')
  const amount = selector(state, 'amount')
  const gweiPerGas = selector(state, 'gweiPerGas')
  const gasLimit = selector(state, 'gasLimit')
  const mode = selector(state, 'mode')
  const formErrors = getFormSyncErrors(FORM_SEND_TOKENS)(state)
  const tokens = getLXTokens(state)
  const token = tokens.item(tokenId)
  const isMultiToken = walletInfo.tokens.length > 1

  return {
    selectedCurrency,
    tokens,
    account: state.get(DUCK_SESSION).account,
    amount,
    token,
    tokenInfo,
    isMultiToken,
    walletInfo,
    recipient,
    symbol,
    mode,
    formErrors,
    formValues: (formValues(state) && JSON.stringify(formValues(state).toJSON())) || null,
    feeMultiplier,
    gasLimit,
    gweiPerGas,
    gasPriceMultiplier: getGasPriceMultiplier(token.blockchain())(state),
  }
}

function mapFormDispatchToProps (dispatch) {
  return {
    estimateGas: (tokenId, params, gasPriceMultiplier, address) => (
      dispatch(estimateLaborHourGasTransfer(tokenId, params, gasPriceMultiplier, address))
    ),
  }
}

const LaborHourForm = connect(mapFormStateToProps, mapFormDispatchToProps)(Form)

export function mapStateToProps (state, props) {
  const fields = mapContainerStateToProps(state, props)
  fields.form = LaborHourForm
  fields.symbol = LHT
  return fields
}

export default connect(mapStateToProps, mapDispatchToProps)(FormContainer)
