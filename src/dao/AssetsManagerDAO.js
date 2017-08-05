import Immutable from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import AssetModel from 'models/AssetModel'

export default class AssetsManagerDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(
      require('chronobank-smart-contracts/build/contracts/AssetsManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  async getList (): Promise<Immutable.Map<AssetModel>> {
    const symbols = await this._call('getAssetsForOwner', [this.getAccount()])

    const promises = []
    for (let symbol of symbols) {
      promises.push(this._call('getAssetBySymbol', [symbol]))
    }
    const addresses = await Promise.all(promises)

    let i = 0
    let map = new Immutable.Map()
    for (let address of addresses) {
      map = map.set(symbols[i], new AssetModel({
        symbol: symbols[i],
        address
      }))
      i++
    }

    return map
  }

  // TODO @bshevchenko: MINT-230 AssetsManager
}
