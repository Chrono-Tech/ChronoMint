import DAO from './DAO';
import contract from 'truffle-contract';

const json = require('../contracts/Rewards.json');
const Rewards = contract(json);

class RewardsDAO extends DAO {
    constructor() {
        super();
        Rewards.setProvider(this.web3.currentProvider);
        this.contract = Rewards.deployed();
    }
}

export default new RewardsDAO();