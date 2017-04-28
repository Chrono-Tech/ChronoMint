import { Record as record } from 'immutable'
import * as validation from '../../components/forms/validate'

export const abstractContractModel = defaultValues => class AbstractContractModel extends record({
  address: null,
  name: null,
  ...defaultValues
}) {
  constructor (data) {
    if (new.target === AbstractContractModel) {
      throw new TypeError('Cannot construct AbstractContractModel instance directly')
    }
    super(data)
  }

  name () {
    return this.get('name')
  };

  address () {
    return this.get('address')
  };
}

export const validate = values => {
  const errors = {}
  errors.address = validation.address(values.get('address'))
  errors.name = validation.name(values.get('name'))
  return errors
}

export default abstractContractModel()
