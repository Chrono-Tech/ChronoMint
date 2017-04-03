import AbstractContractDAO from './AbstractContractDAO'

class ChronoMintDAO extends AbstractContractDAO {
  constructor () {
    super(require('../contracts/ChronoMint.json'))
  }
}

export default new ChronoMintDAO(require('../contracts/ChronoMint.json'))
