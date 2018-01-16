import BigNumber from 'bignumber.js'
import * as validator from 'models/validator'
import ErrorList from 'platform/ErrorList'

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
    buyErrors.add(validator.lowerThan(values.get('buy'), assetBalance.toNumber()))
    sellErrors.add(validator.lowerThan(values.get('sell'), userEthBalance.toNumber()))
  } else {
    buyErrors.add(validator.lowerThan(values.get('buy'), userExchangeTokenBalance.toNumber()))
    sellErrors.add(validator.lowerThan(values.get('sell'), ethBalance.toNumber()))
  }

  return {
    sell: sellErrors.getErrors(),
    buy: buyErrors.getErrors(),
  }

}
