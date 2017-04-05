import * as validate from '../validate'

export default (values, props) => {
  const errors = {}
  const jsValues = values.toJS()

  errors.sendAmount = validate.positiveInt(jsValues.sendAmount)

  if (Number(jsValues.sendAmount) > props.contractsManagerBalance) {
    errors.sendAmount = 'Amount is greater then allowed'
  }

  return errors
}
