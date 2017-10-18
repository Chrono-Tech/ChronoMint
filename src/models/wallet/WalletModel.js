// noinspection JSUnresolvedVariable
import Immutable from 'immutable'

import { abstractModel } from '../AbstractModel'
import OwnerModel from './OwnerModel'

class WalletModel extends abstractModel({
  owners: new Immutable.Map(),
  isNew: true,
  walletName: null,
  dayLimit: null,
  requiredSignatures: null,
}) {
  addOwner (owner: OwnerModel) {
    return this.set('owners', this.owners().set(owner.symbol(), owner))
  }

  // alias
  updateOwner (owner: OwnerModel) {
    return this.addOwner(owner)
  }

  removeOwner (symbol: string) {
    return this.set('owners', this.owners().remove(symbol))
  }

  owners () {
    return this.get('owners')
  }

  ownersCount () {
    return this.owners().size
  }

  isNew () {
    return this.get('isNew')
  }

  walletName () {
    return this.get('walletName')
  }

  dayLimit () {
    return this.get('dayLimit')
  }

  requiredSignatures () {
    return this.get('requiredSignatures')
  }

  validate () {
    return {
      walletName: (typeof this.walletName() === 'string') ? null : 'errors.wallet.walletName.haveToBeString',
      dayLimit: isNaN(this.dayLimit()) ? 'errors.wallet.dayLimit.haveToBeNumber' : null,
      requiredSignatures: this.requiredSignatures() >= 2 ? null : 'errors.wallet.requiredSignatures.haveToBeMoreThanTwoOrEqual',
      ownersCount: this.ownersCount() >= 2 ? null : 'errors.wallet.ownersCount.haveToBeMoreThanTwoOrEqual',
      ownersCollection: this.ownersCollection().validate(),
    }
  }
}

export default WalletModel
