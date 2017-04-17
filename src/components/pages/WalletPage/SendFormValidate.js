import * as validation from '../../forms/validate'

export default (values) => {
  const errors = {}
  const amountPattern = new RegExp(/[^.]\d{2,}/)

  errors.recipient = validation.address(values.get('recipient'))

  if (!values.get('amount')) {
    errors.amount = 'Enter amount for send'
  } else if (amountPattern.test(values.get('amount'))) {
    errors.amount = 'Can have only 2 decimal places'
  }

  return errors
}
