import Immutable from 'immutable'
import OwnerModel from './OwnerModel'
import { abstractModel } from '../AbstractModel'

class OwnersCollection extends abstractModel({
  owners: new Immutable.Map(),
  error: null
}) {
  add (owner: OwnerModel) {
    return this.set('owners', this.owners().set(owner.address(), owner))
  }

  // alias
  update (owner: OwnerModel) {
    return this.add(owner)
  }

  remove (address: string) {
    return this.set('owners', this.owners().remove(address))
  }

  owners () {
    return this.get('owners')
  }

  hasErrors () {
    return this.owners().some(owner => owner.hasErrors())
  }
}

export default OwnersCollection
