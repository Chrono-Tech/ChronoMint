import * as validate from '../validate'

export default (values, props) => {
  const errors = {}
  const jsValues = values.toJS()

  errors.issueAmount = validate.positiveInt(jsValues.issueAmount)

  if ((Number(jsValues.issueAmount) + props.loc.issued()) - props.loc.redeemed() > props.loc.issueLimit()) {
    errors.issueAmount = 'Amount is greater then allowed'
  }

  return errors
}
