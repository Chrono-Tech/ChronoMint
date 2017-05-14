import React from 'react'
import AbstractOtherContractModel from './AbstractOtherContractModel'
import DAOFactory from '../../dao/DAOFactory'
import ExchangeForm from '../../components/forms/settings/other/ExchangeForm'
import validator from '../../components/forms/validator'
import ErrorList from '../../components/forms/ErrorList'

class ExchangeContractModel extends AbstractOtherContractModel {
  dao () {
    return DAOFactory.initExchangeDAO(this.address())
  }

  name () {
    return 'Exchange'
  }

  buyPrice () {
    return parseInt(this.get('settings').buyPrice, 10)
  }

  sellPrice () {
    return parseInt(this.get('settings').sellPrice, 10)
  }

  form (ref, onSubmit) {
    return <ExchangeForm ref={ref} onSubmit={onSubmit} />
  }
}

export const validate = values => {
  const buyPrice = values.get('buyPrice')
  const sellPrice = values.get('sellPrice')

  const buyPriceErrors = ErrorList.toTranslate(validator.positiveInt(buyPrice))

  const sellPriceErrors = new ErrorList()
  sellPriceErrors.add(validator.positiveInt(sellPrice))
  if (sellPriceErrors.getLength() === 0 && parseInt(sellPrice, 10) < parseInt(buyPrice, 10)) {
    sellPriceErrors.add('errors.greaterOrEqualBuyPrice')
  }

  return {
    buyPrice: buyPriceErrors,
    sellPrice: sellPriceErrors.getErrors()
  }
}

export default ExchangeContractModel
