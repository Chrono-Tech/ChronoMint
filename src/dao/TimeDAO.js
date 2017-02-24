import AbstractContractDAO from './AbstractContractDAO';
import AppDAO from './AppDAO';

class TimeDAO extends AbstractContractDAO {
    init = (timeProxyAddress) => {
        return AppDAO.getAddress().then(address => {
            this.contract.then(deploy => deploy.init(timeProxyAddress, {from: address}));
        });
    };
}

export default new TimeDAO(require('../contracts/ChronoBankAsset.json'));