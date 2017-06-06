import ErrorList from '../ErrorList'
import validator from '../validator'
import LS from '../../../utils/LocalStorage'

export default (values, props) => {
  const recipient = values.get('recipient')
  const amount = values.get('amount')
  const currency = values.get('currency')

  const recipientErrors = new ErrorList()
  recipientErrors.add(validator.required(recipient))
  recipientErrors.add(validator.address(recipient))
  if (recipient === LS.getAccount()) {
    recipientErrors.add('errors.cantSentToYourself')
  }

  const token = props.tokens.get(currency)

  if (!token) {
    return // token not yet loaded
  }

  const amountErrors = new ErrorList()
  amountErrors.add(validator.required(amount))

  const decimalsError = validator.currencyNumber(amount, token.decimals())
  if (decimalsError) {
    amountErrors.add({value: decimalsError, decimals: token.decimals()})
  }

  if (token.balance() - amount < 0) {
    amountErrors.add('errors.notEnoughTokens')
  }

  return {
    recipient: recipientErrors.getErrors(),
    amount: amountErrors.getErrors()
  }
}
