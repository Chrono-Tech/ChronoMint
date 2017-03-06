import AbstractOtherContractDAO from './AbstractOtherContractDAO';
import TimeProxyDAO from './TimeProxyDAO';
import RewardsContractModel from '../models/contracts/RewardsContractModel';
import isEthAddress from '../utils/isEthAddress';

export class RewardsDAO extends AbstractOtherContractDAO {
    constructor(at = null) {
        super(require('../contracts/Rewards.json'), at);
    }

    /** @inheritDoc */
    isValid() {
        return new Promise(resolve => {
            this.contract.then(deployed => {
                deployed.sharesContract.call()
                    .then(r => isEthAddress(r) ? resolve(true) : resolve(false))
                    .catch(() => resolve(false))
            });
        });
    };

    /** @return {Promise.<RewardsContractModel>} */
    getContractModel() {
        return this.getAddress().then(address => new RewardsContractModel({address}));
    }

    init = (sharesContract, closeIntervalDays, account) => {
        return this.contract.then(deployed => deployed.init(sharesContract, closeIntervalDays,
            {
                from: account,
                gas: 3000000
            })
        );
    };

    getPeriodLength = () => {
        return this.contract.then(deployed => deployed.closeInterval());
    };

    getSharesContract = () => {
        return this.contract.then(deployed => deployed.sharesContract());
    };

    getPeriods = () => {
        return this.contract.then(deployed => console.log(deployed));
    };

    getLastPeriod = () => {
        return this.contract.then(deployed => deployed.lastPeriod.call());
    };

    getLastClosedPeriod = () => {
        return this.contract.then(deployed => deployed.lastClosedPeriod.call().then(
            (result) => {
                if (result) {
                    return deployed.lastClosedPeriod();
                }
            })
            .catch(e => console.log(e))
        );
    };

    getTotalDepositInPeriod = (periodId: number) => {
        return this.contract.then(deployed => deployed.totalDepositInPeriod(periodId));
    };

    getDepositBalanceInPeriod = (address: string, periodId: number) => {
        return this.contract.then(deployed => deployed.depositBalanceInPeriod(address, periodId));
    };

    getPeriodStartDate = (periodId: number) => {
        return this.contract.then(deployed => deployed.periodStartDate(periodId));
    };

    getPeriodClosedState = (periodId: number) => {
        return this.contract.then(deployed => deployed.isClosed(periodId));
    };

    getAccountDepositBalance = (address: string) => {
        return this.contract.then(deployed => deployed.depositBalance(address));
    };

    getTotalDepositBalance = () => {
        return this.getAddress().then(address => TimeProxyDAO.getAccountBalance(address));
    };

    depositAmount = (amount: number, address: string) => {
        return this.contract.then(deployed =>
            TimeProxyDAO.approve(deployed.address, amount, address).then(() => {
                deployed.deposit(amount, {from: address, gas: 3000000});
            })
        );
    };

    watchError = () => {
        this.contract.then(deployed => deployed.Error().watch((e, r) => {
            console.log(e, r);
        }));
    }
}

export default new RewardsDAO();