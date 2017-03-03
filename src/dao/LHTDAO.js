import AbstractContractDAO from './AbstractContractDAO';
import ExchangeDAO from './ExchangeDAO';

class LHTDAO extends AbstractContractDAO {
    init = (account) => {
        return this.getAddress().then(address => {
            ExchangeDAO.init(address, account);
        });
    };
}

export default new LHTDAO(require('../contracts/ChronoBankAssetWithFee.json'));