import AbstractContractDAO from './AbstractContractDAO';
import TimeProxyDAO from './TimeProxyDAO';

class TimeHolder extends AbstractContractDAO {
    constructor(at) {
        super(require('../contracts/TimeHolder.json'), at, false);
    }

    depositAmount = (amount: number, address: string) => {
        return this.contract.then(deployed =>
            TimeProxyDAO.approve(deployed.address, amount, address).then(() => {
                deployed.deposit(amount, {from: address, gas: 3000000});
            })
        );
    };

}

export default new TimeHolder();