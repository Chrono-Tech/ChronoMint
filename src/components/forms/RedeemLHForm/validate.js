import * as validate from '../validate'

export default (values, props) => {
  const errors = {}
  const jsValues = values.toJS()

  errors.redeemAmount = validate.positiveInt(jsValues.redeemAmount)

  if (Number(jsValues.redeemAmount) > props.allowRedeem) {
    errors.redeemAmount = 'Amount is greater then allowed'
  }

  return errors
}
