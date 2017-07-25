import validator from '../../../forms/validator'
import ErrorList from '../../../forms/ErrorList'

export default (values, props) => {
  const sendAmount = values.get('sendAmount')
  const errorsSendAmount = new ErrorList()
  errorsSendAmount.add(validator.required(sendAmount))
  errorsSendAmount.add(validator.positiveInt(sendAmount))
  if (Number(values.get('sendAmount')) > props.contractsManagerBalance) {
    errorsSendAmount.add('errors.greaterThanAllowed')
  }
  return {
    sendAmount: errorsSendAmount.getErrors()
  }
}