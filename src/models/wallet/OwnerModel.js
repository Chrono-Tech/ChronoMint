import { abstractModel } from '../AbstractModel'
import validator from '../../components/forms/validator'

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
