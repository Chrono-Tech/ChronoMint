import AbstractContractDAO from './AbstractContractDAO'

export const TX_REISSUE_ASSET = 'reissueAsset'
export const TX_REVOKE_ASSET = 'revokeAsset'
export const TX_IS_REISSUABLE = 'isReissuable'
export const TX_ADD_ASSET_PART_OWNER = 'addAssetPartOwner'
export const TX_REMOVE_ASSET_PART_OWNER = 'removeAssetPartOwner'
export const TX_ISSUE = 'Issue'
export const TX_REVOKE = 'Revoke'
export const TX_OWNERSHIP_CHANGE = 'OwnershipChange'

export default class ChronoBankPlatform extends AbstractContractDAO {

  constructor (at = null) {
    super(
      require('chronobank-smart-contracts/build/contracts/ChronoBankPlatform.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  async reissueAsset (token, value) {
    const amount = token.dao().addDecimals(value)
    const tx = await this._tx(
      TX_REISSUE_ASSET,
      [
        token.symbol(),
        amount,
      ],
      {
        symbol: token.symbol(),
        amount: value,
      })
    return tx.tx
  }

  async revokeAsset (token, value) {
    const amount = token.dao().addDecimals(value)
    const tx = await this._tx(
      TX_REVOKE_ASSET,
      [
        token.symbol(),
        amount,
      ],
      {
        symbol: token.symbol(),
        amount: value,
      })
    return tx.tx
  }

  async isReissuable (symbol) {
    return await this._call(TX_IS_REISSUABLE, [symbol])
  }

  async addAssetPartOwner (symbol, address) {
    const tx = await this._tx(TX_ADD_ASSET_PART_OWNER, [symbol, address])
    return tx.tx
  }

  async removeAssetPartOwner (symbol, address) {
    const tx = await this._tx(TX_REMOVE_ASSET_PART_OWNER, [symbol, address])
    return tx.tx
  }

  watchIssue (callback) {
    this._watch(TX_ISSUE, (tx) => {
      const symbol = this._c.bytesToString(tx.args.symbol)
      const value = tx.args.value
      callback(symbol, value, true, tx)
    })
  }

  watchRevoke (callback) {
    this._watch(TX_REVOKE, (tx) => {
      const symbol = this._c.bytesToString(tx.args.symbol)
      const value = tx.args.value
      callback(symbol, value, false, tx)
    })
  }

  watchManagers (callback) {
    this._watch(TX_OWNERSHIP_CHANGE, callback)
  }
}
