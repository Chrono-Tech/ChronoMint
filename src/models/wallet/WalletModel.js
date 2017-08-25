//noinspection JSUnresolvedVariable
import OwnerModel from './OwnerModel'
import OwnersCollection from './OwnersCollection'
import { abstractModel } from '../AbstractModel'

class WalletModel extends abstractModel({
  ownersCollection: new OwnersCollection({}),
  isNew: true,
  walletName: 'New Multisignature Wallet',
  dayLimit: 0,
  requiredSignatures: 2
}) {
  addOwner (owner: OwnerModel) {
    return this.set('ownersCollection', this.ownersCollection().addOwner(owner))
  }

  // alias
  updateOwner (owner: OwnerModel) {
    return this.addOwner(owner)
  }

  removeOwner (symbol: string) {
    return this.ownersCollection().remove(symbol)
  }

  ownersCollection () {
    return this.get('ownersCollection')
  }

  owners () {
    return this.ownersCollection().owners()
  }

  ownersCount () {
    return this.ownersCollection().ownersCount()
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
      walletName: typeof this.walletName() === 'string' ? null : 'errors.wallet.walletName.haveToBeString',
      dayLimit: isNaN(this.dayLimit()) ? 'errors.dayLimit.haveToBeNumber' : null,
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
