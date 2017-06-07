import AbstractContractDAO from './AbstractContractDAO'
import LS from '../utils/LocalStorage'

export default class EmitterDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/ChronoMintEmitter.json'), at)
  }

  // TODO only for test purposes
  watchError () {
    return this.watch('Error', (r) => {
      this.web3.eth.getTransaction(r.transactionHash, (e, tx) => {
        if (!e && tx.from === LS.getAccount()) {
          console.warn('Error event', this._bytesToString(r.args.message))
        }
      })
    }, false)
  }
}
