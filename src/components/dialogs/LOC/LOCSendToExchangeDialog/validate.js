import BigNumber from 'bignumber.js'
import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

export default (values, props) => {
  const sendAmount = values.get('sendAmount')
  const errorsSendAmount = new ErrorList()
  errorsSendAmount.add(validator.positiveNumber(sendAmount))

  const allowed: BigNumber = props.allowed
  try {
    if (allowed.lt(new BigNumber(values.get('sendAmount') || 0))) {
      throw new Error()
    }
  } catch (e) {
    errorsSendAmount.add('errors.greaterThanAllowed')
  }

  return {
    sendAmount: errorsSendAmount.getErrors(),
  }
}
