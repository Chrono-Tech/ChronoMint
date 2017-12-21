import Amount from 'models/Amount'
import { abstractFetchingModel } from '../AbstractFetchingModel'
import AssetsCollection from './AssetsCollection'

export default class AssetHolderModel extends abstractFetchingModel({
  // assetAddress: null,
  account: null, // address of holder contract
  wallet: null, // address of holder wallet
  assetHolderAddress: null,
  assetHolderWalletAddress: null,
  // TODO @dkchv: !!! placeholder
  allowance: new Amount(2, 'TIME', true),
  // TODO @dkchv: !!! placeholder for non-block
  deposit: new Amount(1, 'TIME', true),
  assets: new AssetsCollection(),
}) {
  account (value) {
    return this._getSet('account', value)
  }

  wallet (value) {
    return this._getSet('wallet', value)
  }

  deposit (value) {
    return this._getSet('deposit', value)
  }

  allowance (value) {
    return this._getSet('allowance', value)
  }

  assets (value) {
    return this._getSet('assets', value)
  }
}
