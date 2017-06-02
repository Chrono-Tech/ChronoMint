import AbstractContractDAO from './AbstractContractDAO'

export default class EmitterDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/ChronoMintEmitter.json'), at)
  }
}
