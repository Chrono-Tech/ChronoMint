import AbstractContractDAO from './AbstractContractDAO'

export const TX_ADD_PART_OWNER = 'addPartOwner'
export const TX_REMOVE_PART_OWNER = 'removePartOwner'
export const TX_ADD_ASSET_PART_OWNER = 'addAssetPartOwner'
export const TX_REMOVE_ASSET_PART_OWNER = 'removeAssetPartOwner'

export default class ChronoBankAssetOwnershipManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/ChronoBankAssetOwnershipManager.json'), at)
  }

  async addPartOwner (address) {
    const tx = await this._tx(TX_ADD_PART_OWNER, [address])
    return tx.tx
  }

  async removePartOwner (address) {
    const tx = await this._tx(TX_REMOVE_PART_OWNER, [address])
    return tx.tx
  }

  async addAssetPartOwner (symbol, address) {
    const tx = await this._tx(TX_ADD_ASSET_PART_OWNER, [symbol, address])
    return tx.tx
  }

  async removeAssetPartOwner (symbol, address) {
    const tx = await this._tx(TX_REMOVE_ASSET_PART_OWNER, [symbol, address])
    return tx.tx
  }
}
