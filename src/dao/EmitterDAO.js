import AbstractContractDAO from './AbstractContractDAO'

export default class EmitterDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/ChronoMintEmitter.json'), at)
  }

  watchOnce (event, filters, callback) {
    const watchCallback = (result, block, ts, isOld, filter) => {
      if (!isOld) {
        filter.stopWatching(() => {})
        callback(result.args)
      }
    }
    this.watch(event, watchCallback, null, filters)
  }
}
