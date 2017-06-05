import React from 'react'
import AbstractOtherContractModel from './AbstractOtherContractModel'
import ContractsManagerDAO from '../../dao/ContractsManagerDAO'
import ExchangeForm from '../../components/forms/settings/other/ExchangeForm'
import validator from '../../components/forms/validator'
import ErrorList from '../../components/forms/ErrorList'

class ExchangeContractModel extends AbstractOtherContractModel {
  dao () {
    return ContractsManagerDAO.getExchangeDAO()
  }

  name () {
    return 'Exchange'
  }

  buyPrice () {
    return this.get('settings').buyPrice
  }

  sellPrice () {
    return this.get('settings').sellPrice
  }

  form (ref, onSubmit) {
    return <ExchangeForm ref={ref} onSubmit={onSubmit} />
  }
}

export const validate = values => {
  const buyPrice = values.get('buyPrice')
  const sellPrice = values.get('sellPrice')

  const buyPriceErrors = ErrorList.toTranslate(validator.positiveNumber(buyPrice))

  const sellPriceErrors = new ErrorList()
  sellPriceErrors.add(validator.positiveNumber(sellPrice))
  if (sellPriceErrors.getLength() === 0 && parseFloat(sellPrice) < parseFloat(buyPrice)) {
    sellPriceErrors.add('errors.greaterOrEqualBuyPrice')
  }

  return {
    buyPrice: buyPriceErrors,
    sellPrice: sellPriceErrors.getErrors()
  }
}

export default ExchangeContractModel
