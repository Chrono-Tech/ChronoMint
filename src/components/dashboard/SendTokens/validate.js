import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

export default (values, props) => {
  const { token, wallet } = props
  if (!token) {
    return
  }

  const amount = values.get('amount')
  const recipient = values.get('recipient')

  const amountFormatError = validator.currencyNumber(amount, token.decimals())
  const amountErrors = new ErrorList()
    .add(validator.required(amount))
    .add(amountFormatError)

  if (!amountFormatError) {
    // validate only numbers
    amountErrors.add(token.balance().minus(amount).lt(0) ? 'error.notEnoughTokens' : null)
  }

  return {
    recipient: new ErrorList()
      .add(validator.required(recipient))
      .add(token.dao().getAddressValidator()(recipient))
      .add(recipient === wallet.address() ? 'errors.cantSentToYourself' : null)
      .getErrors(),
    amount: amountErrors.getErrors(),
  }
}
