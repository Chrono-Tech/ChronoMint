import validator from 'models/validator'
import { abstractModel } from '../AbstractModel'

class OwnerModel extends abstractModel({
  address: null,
  editing: false,
}) {
  address () {
    return this.get('address')
  }

  editing () {
    return this.get('editing')
  }

  validate () {
    return validator.address(this.address())
  }
}

export default OwnerModel
