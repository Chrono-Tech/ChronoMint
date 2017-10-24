import AbstractContractDAO from './AbstractContractDAO'

export const TX_REISSUE_ASSET = 'reissueAsset'
export const TX_REVOKE_ASSET = 'revokeAsset'
export const TX_IS_REISSUABLE = 'isReissuable'

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

  async revokeAsset (symbol, amount) {
    const tx = await this._tx(TX_REVOKE_ASSET, [symbol, amount])
    return tx.tx
  }

  async isReissuable (symbol) {
    return await this._call(TX_IS_REISSUABLE, [symbol])
  }

  watchIssue (callback) {
    return this._watch('Issue', callback)
  }

  watchRevoke (callback) {
    return this._watch('Revoke', callback)
  }
}
