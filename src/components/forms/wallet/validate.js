import ErrorList from '../ErrorList'
import validator from '../validate'
import LS from '../../../dao/LocalStorageDAO'

export default (values, props) => {
  const recipient = values.get('recipient')
  const amount = values.get('amount')
  const currencyId = values.get('currency')

  const errorsRecipient = new ErrorList()
  errorsRecipient.add(validator.required(recipient))
  errorsRecipient.add(validator.address(recipient))
  if (recipient === LS.getAccount()) {
    errorsRecipient.add('errors.cantSentToYourself')
  }

  const errorsAmount = new ErrorList()
  errorsAmount.add(validator.required(amount))
  errorsAmount.add(validator.currencyNumber(amount))

  const balance = props.balances[currencyId]
  if (balance - amount < 0) {
    errorsAmount.add('errors.notEnoughTokens')
  }

  return {
    recipient: errorsRecipient.getErrors(),
    amount: errorsAmount.getErrors()
  }
}
