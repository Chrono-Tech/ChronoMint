import Amount from 'models/Amount'
import { abstractFetchingModel } from '../AbstractFetchingModel'
import AssetsCollection from './AssetsCollection'

export default class AssetHolderModel extends abstractFetchingModel({
  // assetAddress: null,
  account: null, // address of holder contract
  wallet: null, // address of holder wallet
  assetHolderAddress: null,
  assetHolderWalletAddress: null,
  assets: new AssetsCollection(),
}) {
  account (value) {
    return this._getSet('account', value)
  }

  wallet (value) {
    return this._getSet('wallet', value)
  }

  allowance (value) {
    return this._getSet('allowance', value)
  }

  assets (value) {
    return this._getSet('assets', value)
  }

  isDeposited () {
    return this.assets().list().some((item) => {
      return item.deposit().gt(0)
    })
  }
}
