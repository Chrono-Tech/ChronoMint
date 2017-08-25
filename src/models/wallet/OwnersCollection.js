//noinspection JSUnresolvedVariable
import Immutable from 'immutable'
import OwnerModel from './OwnerModel'
import { abstractModel } from '../AbstractModel'

class OwnersCollection extends abstractModel({
  owners: new Immutable.Map()
}) {
  addOwner (owner: OwnerModel) {
    return this.set('owners', this.owners().set(owner.symbol(), owner))
  }

  // alias
  update (owner: OwnerModel) {
    return this.addOwner(owner)
  }

  remove (symbol: string) {
    return this.set('owners', this.owners().remove(symbol))
  }

  owners () {
    return this.get('owners')
  }

  ownersCount () {
    return this.owners().size
  }

  validate () {
    return this.owners().toArray().map(owner => owner.validate())
  }

}

export default OwnersCollection
