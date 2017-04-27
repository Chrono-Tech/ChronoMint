import AbstractContractDAO from './AbstractContractDAO'

class PlatformDAO extends AbstractContractDAO {
  getHoldersCount () {
    return this._call('holdersCount').then(r => r.toNumber())
  }
}

export default new PlatformDAO(require('chronobank-smart-contracts/build/contracts/ChronoBankPlatform.json'))
