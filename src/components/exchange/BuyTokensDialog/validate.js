/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import * as validator from '@chronobank/core/models/validator'
import ErrorList from '@chronobank/core-dependencies/ErrorList'

export default function validate (values, props) {
  const exchangeToken = props.tokens.item(props.exchange.symbol())
  const ethToken = props.tokens.item('ETH')

  let buyErrors = new ErrorList()
  buyErrors.add(validator.positiveNumber(values.get('buy'), true))

  let sellErrors = new ErrorList()
  sellErrors.add(validator.positiveNumber(values.get('sell'), true))

  const userEthBalance = ethToken.removeDecimals(props.balances.item('ETH').amount())
  let userExchangeTokenBalance = exchangeToken.removeDecimals(props.balances.item(props.exchangeToken.id()).amount())
  if (!userExchangeTokenBalance) {
    userExchangeTokenBalance = new BigNumber(0)
  }
  const assetBalance = exchangeToken.removeDecimals(props.exchange.assetBalance())
  const ethBalance = ethToken.removeDecimals(props.exchange.ethBalance())

  if (props.isBuy) {
    buyErrors.add(validator.lowerThan(values.get('buy'), assetBalance.toNumber(), true))
    sellErrors.add(validator.lowerThan(values.get('sell'), userEthBalance.toNumber(), true))
  } else {
    buyErrors.add(validator.lowerThan(values.get('buy'), userExchangeTokenBalance.toNumber(), true))
    sellErrors.add(validator.lowerThan(values.get('sell'), ethBalance.toNumber(), true))
  }

  return {
    sell: sellErrors.getErrors(),
    buy: buyErrors.getErrors(),
  }

}
