import * as validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'
import TokenModel from 'models/tokens/TokenModel'

export default function validate (values, props) {
  let buyErrors = new ErrorList()
  buyErrors.add(validator.positiveNumber(values.get('buy'), true))

  let sellErrors = new ErrorList()
  sellErrors.add(validator.positiveNumber(values.get('sell'), true))

  const userEthBalance = props.usersTokens.get('ETH').balance()
  let userExchangeTokenBalance = props.usersTokens.get(props.exchange.symbol())
  if (!userExchangeTokenBalance) {
    userExchangeTokenBalance = new TokenModel({})
  }
  const assetBalance = props.exchange.assetBalance()
  const ethBalance = props.exchange.ethBalance()

  if (props.isBuy) {
    buyErrors.add(validator.lowerThan(values.get('buy'), assetBalance.toNumber()))
    sellErrors.add(validator.lowerThan(values.get('sell'), userEthBalance.toNumber()))
  } else {
    buyErrors.add(validator.lowerThan(values.get('buy'), userExchangeTokenBalance.balance().toNumber()))
    sellErrors.add(validator.lowerThan(values.get('sell'), ethBalance.toNumber()))
  }

  return {
    sell: sellErrors.getErrors(),
    buy: buyErrors.getErrors(),
  }

}
