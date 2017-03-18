import AbstractOtherContractDAO from './AbstractOtherContractDAO';
import TimeProxyDAO from './TimeProxyDAO';
import RewardsContractModel from '../models/contracts/RewardsContractModel';

export class RewardsDAO extends AbstractOtherContractDAO {
    static getTypeName() {
        return 'Rewards';
    }

    static getJson() {
        return require('../contracts/Rewards.json');
    }

    constructor(at = null) {
        super(RewardsDAO.getJson(), at);
    }

    static getContractModel() {
        return RewardsContractModel;
    }

    /** @return {Promise.<RewardsContractModel>} */
    initContractModel() {
        const Model = RewardsDAO.getContractModel();
        return this.getAddress().then(address => new Model(address));
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