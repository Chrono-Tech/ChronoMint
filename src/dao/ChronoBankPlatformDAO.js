import tokenService from 'services/TokenService'
import AbstractContractDAO from './AbstractContractDAO'
import { ChronoBankPlatformABI, MultiEventsHistoryABI } from './abi'

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
    super(ChronoBankPlatformABI, at, MultiEventsHistoryABI)
  }

  async reissueAsset (token, value) {
    try {
      const amount = token.addDecimals(value, token)
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
    } catch (e) {
      // eslint-disable-next-line
      console.log(e.message)
    }
  }

  async revokeAsset (token, value) {
    const amount = token.addDecimals(value, token)
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

  isReissuable (symbol) {
    return this._call(TX_IS_REISSUABLE, [ symbol ])
  }

  async addAssetPartOwner (symbol, address) {
    const tx = await this._tx(TX_ADD_ASSET_PART_OWNER, [ symbol, address ])
    return tx.tx
  }

  async removeAssetPartOwner (symbol, address) {
    const tx = await this._tx(TX_REMOVE_ASSET_PART_OWNER, [ symbol, address ])
    return tx.tx
  }

  watchIssue (callback) {
    return this._watch(TX_ISSUE, (tx) => {
      const symbol = this._c.bytesToString(tx.args.symbol)
      const value = tx.args.value
      callback(symbol, value, true, tx)
    })
  }

  watchRevoke (callback) {
    return this._watch(TX_REVOKE, (tx) => {
      const symbol = this._c.bytesToString(tx.args.symbol)
      const value = tx.args.value
      callback(symbol, value, false, tx)
    })
  }

  watchManagers (callback) {
    return this._watch(TX_OWNERSHIP_CHANGE, callback)
  }
}
