/* eslint new-cap: ["error", { "capIsNewExceptions": ["Transfer"] }] */
import AbstractContractDAO from './AbstractContractDAO'

class PlatformEmitterDAO extends AbstractContractDAO {
  watchAll = (callback) => {
    return this.contract.then(deployed => deployed.allEvents().watch(callback))
  };

  watchTransfer = (callback, fromBlock = 'latest') => {
    return this.contract.then(deployed => {
      return deployed.Transfer({}, {fromBlock: 0, toBlock: 'latest'}).watch(callback)
    })
  };
}

export default new PlatformEmitterDAO(require('../contracts/ChronoBankPlatformEmitter.json'))
