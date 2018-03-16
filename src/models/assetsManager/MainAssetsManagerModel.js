import { abstractFetchingModel } from '../AbstractFetchingModel'
import TransactionsCollection from '../wallet/TransactionsCollection'

export default class MainAssetsManagerModel extends abstractFetchingModel({
  usersPlatforms: [],
  selectedToken: null,
  selectedPlatform: null,
  managersCount: 0,
  tokensOnCrowdsaleCount: 0,
  platformsList: [],
  assets: {},
  watchers: {},
  transactionsList: new TransactionsCollection(),
}) {

  usersPlatforms (value) {
    return this._getSet('usersPlatforms', value)
  }

  selectedToken (value) {
    return this._getSet('selectedToken', value)
  }

  selectedPlatform (value) {
    return this._getSet('selectedPlatform', value)
  }

  managersCount (value) {
    return this._getSet('managersCount', value)
  }

  tokensOnCrowdsaleCount (value) {
    return this._getSet('tokensOnCrowdsaleCount', value)
  }

  platformsList (value) {
    return this._getSet('platformsList', value)
  }

  assets (value) {
    return this._getSet('assets', value)
  }

  watchers (value) {
    return this._getSet('watchers', value)
  }

  transactionsList (value) {
    return this._getSet('transactionsList', value)
  }
}
