import validator from '../../forms/validator'
import ErrorList from '../../forms/ErrorList'

const FEE = 0.01

export default (values, props) => {
  const currency = values.get('currency')
  const amountInLHT = +values.get('amount')

  const sellPrice = props.rates.get(currency).sellPrice()
  const buyPrice = props.rates.get(currency).buyPrice()
  const buyVolumeInETH = sellPrice * amountInLHT * 100000000
  const sellVolumeInETH = buyPrice * amountInLHT * 100000000
  const accountBalanceInETH = props.accountBalances['ETH']
  const accountBalanceInLHT = props.accountBalances[currency]
  const platformBalanceInLHT = props.platformBalances[currency]
  const platformBalanceInETH = props.platformBalances['ETH']

  const amountErrors = new ErrorList()
  amountErrors.add(validator.required(amountInLHT))
  amountErrors.add(validator.currencyNumber(amountInLHT))

  if (values.get('buy')) {
    if (buyVolumeInETH > accountBalanceInETH) {
      amountErrors.add('errors.notEnoughTokens')
    }
    if (amountInLHT > platformBalanceInLHT) {
      amountErrors.add('errors.platformNotEnoughTokens')
    }
  } else {
    if (sellVolumeInETH > platformBalanceInETH) {
      amountErrors.add('errors.platformNotEnoughTokens')
    }
    // LHT token with fee
    if (amountInLHT / (1 + FEE) > accountBalanceInLHT) {
      amountErrors.add('errors.notEnoughTokens')
    }
  }

  return {
    amount: amountErrors.getErrors()
  }
}
