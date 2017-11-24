import * as validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'
import { I18n } from 'react-redux-i18n'

export default function validate (values, props) {
  let buyErrors = new ErrorList()
  buyErrors.add(validator.positiveNumber(values.get('buy'), true))

  let sellErrors = new ErrorList()
  sellErrors.add(validator.positiveNumber(values.get('sell'), true))

  const userEthBalance = props.usersTokens.get('ETH').balance()
  const exchangeTokenBalance = props.tokens.getBySymbol(props.exchange.symbol()).balance()
  const assetBalance = props.exchange.assetBalance()
  const ethBalance = props.exchange.ethBalance()

  if (props.isBuy) {

    if (values.get('buy') > assetBalance.toNumber()) {
      buyErrors.add(I18n.t('components.exchange.BuyTokensDialog.amountMustBeLess', {
        amount: assetBalance.toString().replace(/\./, ','),
      }))
    }

    if (values.get('sell') > userEthBalance.toNumber()) {
      sellErrors.add(I18n.t('components.exchange.BuyTokensDialog.amountMustBeLess', {
        amount: userEthBalance.toString().replace(/\./, ','),
      }))

    }

  } else {

    if (values.get('buy') > exchangeTokenBalance.toNumber()) {
      buyErrors.add(I18n.t('components.exchange.BuyTokensDialog.amountMustBeLess', {
        amount: exchangeTokenBalance.toString().replace(/\./, ','),
      }))
    }

    if (values.get('sell') > ethBalance.toNumber()) {
      sellErrors.add(I18n.t('components.exchange.BuyTokensDialog.amountMustBeLess', {
        amount: ethBalance.toString().replace(/\./, ','),
      }))

    }

  }

  return {
    sell: sellErrors.getErrors(),
    buy: buyErrors.getErrors(),
  }

}
