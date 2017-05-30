import AbstractContractDAO from './AbstractContractDAO'

class EmitterDAO extends AbstractContractDAO {
}

export default new EmitterDAO(require('chronobank-smart-contracts/build/contracts/ChronoMintEmitter.json'))
