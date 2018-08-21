/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from '@chronobank/core-dependencies/ErrorList'
import * as validator from '@chronobank/core/models/validator'
import tokenService from '@chronobank/core/services/TokenService'
import { MODE_ADVANCED } from 'components/constants'

export default (values, props) => {
  const { token, wallet, tokenInfo } = props
  if (!token) {
    return
  }

  const balance = token.addDecimals(tokenInfo.amount)
  const amount = values.get('amount')
  const recipient = values.get('recipient')
  const satPerByte = values.get('satPerByte')
  const gweiPerGas = values.get('gweiPerGas')
  const gasLimit = values.get('gasLimit')
  const mode = values.get('mode')

  const satPerByteError = validator.positiveNumber(satPerByte)
  const satPerByteErrors = new ErrorList()
    .add(mode === MODE_ADVANCED ? validator.required(amount) : null)
    .add(satPerByteError)

  const gweiPerGasError = validator.positiveNumber(gweiPerGas)
  const gweiPerGasErrors = new ErrorList()
    .add(mode === MODE_ADVANCED ? validator.required(gweiPerGas) : null)
    .add(gweiPerGasError)

  const gasLimitErrors = new ErrorList()
  if (gasLimit) {
    gasLimitErrors.add(validator.positiveNumber(gasLimit))
  }

  const amountFormatError = validator.currencyNumber(amount, token.decimals())
  const amountErrors = new ErrorList()
    .add(validator.required(amount))
    .add(amountFormatError)

  if (!amountFormatError) {
    // validate only numbers
    const amountWithDecimals = token.addDecimals(amount)
    amountErrors.add(balance.minus(amountWithDecimals).lt(0) ? 'errors.notTokens' : null)
  }

  const tokenDAO = tokenService.getDAO(token.id())
  const addressValidator = tokenDAO
    ? tokenDAO.getAddressValidator()
    : () => ''

  return {
    recipient: new ErrorList()
      .add(validator.required(recipient))
      .add(addressValidator(recipient, true, token.blockchain()))
      .add(recipient === wallet.address ? 'errors.cantSentToYourself' : null)
      .getErrors(),
    amount: amountErrors.getErrors(),
    satPerByte: satPerByteErrors.getErrors(),
    gweiPerGas: gweiPerGasErrors.getErrors(),
    gasLimit: gasLimitErrors.getErrors(),
  }
}
