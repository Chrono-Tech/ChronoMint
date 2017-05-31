import AbstractContractDAO from './AbstractContractDAO'

export default class PlatformEmitterDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/ChronoBankPlatformEmitter.json'), at)
  }
}
