import { abstractModel } from '../AbstractModel'
import validator from '../../components/forms/validator'
import ErrorList from '../../components/forms/ErrorList'

export const abstractContractModel = defaultValues => class AbstractContractModel extends abstractModel({
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
  }

  address () {
    return this.get('address')
  }
}

export const validate = values => {
  const errors = {}
  errors.address = ErrorList.toTranslate(validator.address(values.get('address')))
  errors.name = ErrorList.toTranslate(validator.name(values.get('name')))
  return errors
}

export default abstractContractModel()
