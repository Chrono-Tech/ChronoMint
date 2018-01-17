import ErrorList from 'platform/ErrorList'
import * as validator from 'models/validator'

const OWNER_LIMIT = 2

export default (values, props) => {
  const requiredSignatures = values.get('requiredSignatures')
  const owners = values.get('owners')

  let ownersErrors

  if (!props.pristine) {
    ownersErrors = owners.size < OWNER_LIMIT - 1
      ? {
        _error: new ErrorList()
          .add(validator.moreThan(owners.size, OWNER_LIMIT, true))
          .getErrors(),
      }
      : values.get('owners').toArray().map((item) => {
        return {
          address: new ErrorList()
            .add(validator.address(item && item.get('address')))
            .getErrors(),
        }
      })
  }

  return {
    requiredSignatures: new ErrorList()
      .add(validator.required(requiredSignatures))
      .add(validator.positiveNumber(requiredSignatures))
      .add(validator.moreThan(requiredSignatures, 2, true))
      .getErrors(),
    owners: ownersErrors,
  }
}
