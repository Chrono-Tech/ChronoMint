import DAO from './DAO';
import contract from 'truffle-contract';
const json = require('../contracts/LOC.json');
const LOC = contract(json);

class LocDAO extends DAO {
    constructor(address: string) {
        super();
        LOC.setProvider(this.web3.currentProvider);

        this.contract = LOC.at(address);
    }

    isController = (account) => {
        this.contract.then(deployed => deployed.isController.call(account, {from: account}));
    };
}

export default LocDAO;