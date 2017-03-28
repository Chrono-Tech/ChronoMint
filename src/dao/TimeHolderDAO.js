import AbstractContractDAO from './AbstractContractDAO';
import TimeProxyDAO from './TimeProxyDAO';

class TimeHolderDAO extends AbstractContractDAO {
    depositAmount(amount: number, account: string) {
        return this.contract.then(deployed =>
            TimeProxyDAO.approve(deployed.address, amount, account).then(() => {
                deployed.deposit(amount, {from: account, gas: 3000000});
            })
        );
    };

    getAccountDepositBalance(account: string) {
        return this.contract.then(deployed => deployed.depositBalance(account));
    };
}

export default new TimeHolderDAO(require('../contracts/TimeHolder.json'));