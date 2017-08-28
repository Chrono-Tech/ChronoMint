//noinspection JSUnresolvedVariable
import Immutable from 'immutable'
import OwnerModel from './OwnerModel'
import { abstractModel } from '../AbstractModel'

class WalletModel extends abstractModel({
  owners: new Immutable.Map(),
  isNew: true,
  walletName: null,
  dayLimit: null,
  requiredSignatures: null
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
    //const ownersCollection = []
    const validate = {
      walletName: (typeof this.walletName() === 'string') ? null : 'errors.wallet.walletName.haveToBeString',
      dayLimit: isNaN(this.dayLimit()) ? 'errors.wallet.dayLimit.haveToBeNumber' : null,
      requiredSignatures: this.requiredSignatures() >= 2 ? null : 'errors.wallet.requiredSignatures.haveToBeMoreThanTwoOrEqual',
      ownersCount: this.ownersCount() >= 2 ? null : 'errors.wallet.ownersCount.haveToBeMoreThanTwoOrEqual',
      //ownersCollection: this.ownersCollection().validate()
    }
    //this.ownersCollection().validate().forEach(res => {
    //  if (Object.keys(res).length !== 0) {
    //    ownersCollection.push(res)
    //  }
    //})
    //console.log('WalletModel, validate =', validate)
    return validate
  }
}

export default WalletModel
