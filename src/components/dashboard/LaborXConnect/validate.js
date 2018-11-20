/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as validator from '@chronobank/core/models/validator'
import ErrorList from 'utils/ErrorList'
import { FORM_LABOR_X_CONNECT } from '../../constants'

export default (values, props) => {
  const max = props.miningBalance.plus(props.deposit)
  const amount = values.get('amount')
  const isCustomNode = values.get('isCustomNode')
  const delegateAddress = values.get('delegateAddress')

  const symbolErrors = new ErrorList()
  const amountErrors = new ErrorList()
  const delegateAddressErrors = new ErrorList()

  symbolErrors
    .add(validator.required(values.get('symbol')))

  if (props.form === FORM_LABOR_X_CONNECT) {
    amountErrors.add(validator.required(amount))
    amountErrors.add(validator.positiveNumber(amount))
  }

  amountErrors.add(validator.lowerThan(amount, max.toNumber(), true))

  if (isCustomNode) {
    delegateAddressErrors.add(validator.address(delegateAddress))
  }

  return {
    symbol: symbolErrors.getErrors(),
    amount: amountErrors.getErrors(),
    delegateAddress: delegateAddressErrors.getErrors(),
  }
}
