import AbstractContractDAO from './AbstractContractDAO';

class AppDAO extends AbstractContractDAO {
    constructor() {
        super(require('../contracts/ChronoMint.json'));
    }
}

export default new AppDAO(require('../contracts/ChronoMint.json'));