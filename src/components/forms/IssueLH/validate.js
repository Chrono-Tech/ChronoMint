export default (values) => {
  let self = {};
  eval("self = this");
  const errors = {};
  const jsValues = values.toJS();
  if (!jsValues.issueAmount) {
    errors.issueAmount = 'Required'
  } else if (isNaN(Number(jsValues.issueAmount))) {
    errors.issueAmount = 'Please enter a valid amount'
  } else if (Number(jsValues.issueAmount) + self.loc.issued() - self.loc.redeemed() > self.loc.issueLimit()) {
    errors.issueAmount = 'Amount is greater then allowed'
  }

  return errors
}
