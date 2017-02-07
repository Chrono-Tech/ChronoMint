import DAO from './dao';
import LOC from '../contracts/LOC.sol';

class LocDAO extends DAO {
    constructor(address: string) {
        super();
        LOC.setProvider(this.web3.currentProvider);

        this.contract = LOC.at(address);
    }

    isController = (account) => {
        this.contract.isController.call(account, {from: account});
    };
}

export default LocDAO;