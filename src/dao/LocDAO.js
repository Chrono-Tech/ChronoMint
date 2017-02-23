import AbstractContractDAO from './AbstractContractDAO';

class LocDAO extends AbstractContractDAO {
    constructor(at) {
        super(require('../contracts/LOC.json'), at);
    }

    isController = (account) => {
        this.contract.then(deployed => deployed.isController.call(account, {from: account}));
    };
}

export default LocDAO;