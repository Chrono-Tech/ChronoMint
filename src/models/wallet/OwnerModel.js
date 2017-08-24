import { abstractModel } from '../AbstractModel'

class OwnerModel extends abstractModel({
  address: null,
  editing: false,
  error: null
}) {
  address () {
    return this.get('address')
  }

  editing () {
    return this.get('editing')
  }

  hasErrors () {
    return this.get('error')
  }
}

export default OwnerModel
