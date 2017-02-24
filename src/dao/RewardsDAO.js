import AbstractContractDAO from './AbstractContractDAO';

class RewardsDAO extends AbstractContractDAO {
}

export default new RewardsDAO(require('../contracts/Rewards.json'));