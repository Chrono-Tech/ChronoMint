import ErrorList from 'platform/ErrorList'
import * as validator from 'models/validator'

export default (values, props) => {
  const requiredSignatures = values.get('requiredSignatures')
  const limit = props.initialValues.get('ownersCount')

  return {
    requiredSignatures: new ErrorList()
      .add(validator.required(requiredSignatures))
      .add(validator.positiveNumber(requiredSignatures))
      .add(validator.lowerThan(requiredSignatures, limit, true))
      .getErrors(),
  }
}
