import AbstractContractDAO from './AbstractContractDAO';
import TimeProxyDAO from './TimeProxyDAO';

class TimeHolder extends AbstractContractDAO {
    constructor(at) {
        super(require('../contracts/TimeHolder.json'), at, false);
    }

    depositAmount = (amount: number, account: string) => {
        return this.contract.then(deployed =>
            TimeProxyDAO.approve(deployed.address, amount, account).then(() =>
                deployed.deposit.call(amount, {from: account, gas: 3000000}).then( r => {
                    if (r) {
                        deployed.deposit(amount, {from: account, gas: 3000000});
                    }
                    return  r;
                })
            )
        );
    };

    withdrawAmount = (amount: number, account: string) => {
        return this.contract.then(deployed =>
            deployed.withdrawShares.call(amount, {from: account}).then( r => {
                if (r) {
                    deployed.withdrawShares(amount, {from: account, gas: 3000000});
                }
                return r;
            })
        );
    };

    getDepositBalance = (account: string) => {
        return this.contract.then(deployed => deployed.depositBalance(account)).then(r => r.toNumber());
    };

}

export default new TimeHolder();