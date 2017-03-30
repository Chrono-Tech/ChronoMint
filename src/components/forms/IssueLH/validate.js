export default (values, props) => {
  const errors = {}
  const jsValues = values.toJS()
  if (!jsValues.issueAmount) {
    errors.issueAmount = 'Required'
  } else if (isNaN(Number(jsValues.issueAmount))) {
    errors.issueAmount = 'Please enter a valid amount'
  } else if (Number(jsValues.issueAmount) + props.loc.issued() - props.loc.redeemed() > props.loc.issueLimit()) {
    errors.issueAmount = 'Amount is greater then allowed'
  }

  return errors
}
