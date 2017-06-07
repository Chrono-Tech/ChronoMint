import validator from '../validator'
import ErrorList from '../ErrorList'

export default (values, props) => {
  const issueAmount = +values.get('issueAmount')
  const issueAmountErrors = new ErrorList()
  issueAmountErrors.add(validator.required(issueAmount))
  issueAmountErrors.add(validator.positiveInt(issueAmount))
  if (issueAmount > props.loc.issueLimit() - props.loc.issued()) {
    issueAmountErrors.add('errors.greaterThanAllowed')
  }
  return {
    issueAmount: issueAmountErrors.getErrors()
  }
}
