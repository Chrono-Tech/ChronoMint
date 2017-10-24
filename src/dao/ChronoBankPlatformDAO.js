import AbstractContractDAO from './AbstractContractDAO'

export const TX_REISSUE_ASSET = 'reissueAsset'

export default class ChronoBankPlatform extends AbstractContractDAO {

  constructor (at = null) {
    super(
      require('chronobank-smart-contracts/build/contracts/ChronoBankPlatform.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  async reissueAsset (symbol, amount) {
    const tx = await this._tx(TX_REISSUE_ASSET, [symbol, amount])
    return tx.tx
  }

  watchAssets (callback) {
    return this._watch('Issue', callback)
  }
}
