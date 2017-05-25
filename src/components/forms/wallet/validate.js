import ErrorList from '../ErrorList'
import validator from '../validator'
import LS from '../../../utils/LocalStorage'

export default (values, props) => {
  const recipient = values.get('recipient')
  const amount = values.get('amount')
  const currencyId = values.get('currency')

  const recipientErrors = new ErrorList()
  recipientErrors.add(validator.required(recipient))
  recipientErrors.add(validator.address(recipient))
  if (recipient === LS.getAccount()) {
    recipientErrors.add('errors.cantSentToYourself')
  }

  const amountErrors = new ErrorList()
  amountErrors.add(validator.required(amount))
  amountErrors.add(validator.currencyNumber(amount))

  const balance = props.balances[currencyId]
  if (balance - amount < 0) {
    amountErrors.add('errors.notEnoughTokens')
  }

  return {
    recipient: recipientErrors.getErrors(),
    amount: amountErrors.getErrors()
  }
}
