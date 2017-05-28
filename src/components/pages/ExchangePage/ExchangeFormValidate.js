import { I18n } from 'react-redux-i18n'
import { declarativeValidator } from '../../../utils/validator'

const FEE = 0.01

export default (values, props) => {
  let errors = declarativeValidator({
    amount: 'required|currency-number'
  })(values)

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

  if (!errors.amount) {
    if (values.get('buy')) {
      if (buyVolumeInETH > accountBalanceInETH) {
        errors.amount = I18n.t('errors.notEnoughTokens')
      } else if (amountInLHT > platformBalanceInLHT) {
        errors.amount = I18n.t('errors.platformNotEnoughTokens')
      }
    } else {
      if (sellVolumeInETH > platformBalanceInETH) {
        errors.amount = I18n.t('errors.platformNotEnoughTokens')
      } else if (amountInLHT / (1 + FEE) > accountBalanceInLHT) { // LHT token with fee
        errors.amount = I18n.t('errors.notEnoughTokens')
      }
    }
  }

  return errors
}
