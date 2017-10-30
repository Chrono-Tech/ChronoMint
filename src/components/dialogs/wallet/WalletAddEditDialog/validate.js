import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

const OWNER_LIMIT = 2

export default (values, props) => {
  const name = values.get('name')
  const requiredSignatures = values.get('requiredSignatures')
  const owners = values.get('owners')

  let ownersErrors

  if (!props.pristine) {
    ownersErrors = owners.size < OWNER_LIMIT - 1
      ? {
        _error: new ErrorList()
          .add(validator.moreThan(owners.size, OWNER_LIMIT, true))
          .getErrors()
      }
      : values.get('owners').toArray().map((item) => {
        return {
          address: new ErrorList()
            .add(validator.address(item && item.get('address')))
            .getErrors()
        }
      })
  }

  return {
    name: new ErrorList()
      .add(validator.required(name))
      .add(validator.name(name))
      .getErrors(),
    requiredSignatures: new ErrorList()
      .add(validator.required(requiredSignatures))
      .add(validator.moreThan(requiredSignatures, 2))
      .getErrors(),
    owners: ownersErrors
  }
}
