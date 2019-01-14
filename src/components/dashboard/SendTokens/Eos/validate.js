/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import { lowerThan, eosAccount } from '@chronobank/core/models/validator'

export default (values, props) => {
  const { wallet } = props

  const amount = values.get('amount')
  const recipient = values.get('recipient')
  const symbol = values.get('symbol')
  const balance = wallet ? wallet.balances[symbol] : null

  const amountErrors = new ErrorList()
    .add(lowerThan(amount, balance, true))

  const accountErrors = new ErrorList()
    .add(eosAccount(recipient, true, wallet.blockchain))

  return {
    recipient: accountErrors.getErrors(),
    amount: amountErrors.getErrors(),
  }
}
