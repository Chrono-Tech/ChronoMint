/*eslint new-cap: ["error", { "capIsNewExceptions": ["Confirmation", "Revoke"] }]*/
import AbstractContractDAO from './AbstractContractDAO';

class PendingManagerDAO extends AbstractContractDAO {
    constructor(at) {
        super(require('../contracts/PendingManager.json'), at, false);
    }

    hasConfirmed(conf_sign: string, checkingAccount: string, fromAccount: string) {
        return this.contract.then(deployed => deployed.hasConfirmed.call(conf_sign, checkingAccount, {from: fromAccount}));
    };

    pendingYetNeeded(conf_sign: string, account: string) {
        return this.contract.then(deployed => deployed.pendingYetNeeded.call(conf_sign, {from: account}))
            .then(r => r.toNumber());
    };

    pendingsCount(account: string) {
        return this.contract.then(deployed => deployed.pendingsCount.call({from: account}))
            .then(r => r.toNumber());
    };

    pendingById(index: number, account: string) {
        return this.contract.then(deployed => deployed.pendingById.call(index, {from: account}));
    };

    getTxsType(conf_sign: string, account: string) {
        return this.contract.then(deployed => deployed.getTxsType.call(conf_sign, {from: account}));
    };

    getTxsData(conf_sign: string, account: string) {
        return this.contract.then(deployed => deployed.getTxsData.call(conf_sign, {from: account}));
    };

    revoke(conf_sign: string, account: string) {
        return this.contract.then(deployed => deployed.revoke(conf_sign, {from: account}));
    };

    confirm(conf_sign: string, account: string) {
        return this.contract.then(deployed => deployed.confirm(conf_sign, {from: account, gas: 3000000}));
    };

    confirmationGet(callback, filter = null) {
        return this.contract.then(deployed =>
            deployed.Confirmation({}, filter).get(callback))
    };

    // revokeGet = (callback, filter = null) => this.contract.then(deployed => deployed.Revoke({}, filter).get(callback));

    // revokeWatch = (callback, filter = null) => this.contract.then(deployed =>
    //     deployed.Revoke({}, filter, callback));
    //
    newRevokeOperationWatch(callback) {
        this.contract.then(deployed => {
            const blockNumber = this.web3.eth.blockNumber;
            deployed.Revoke({}, {}, (e, r) => {
                if (r.blockNumber > blockNumber) callback(r.args.operation);
            })
        });
    }

    // confirmationWatch = (callback, filter = null) => this.contract.then(deployed =>
    //     deployed.Confirmation({}, filter, (e, r) => callback(r.args.operation)));
    //
    newConfirmationWatch(callback) {
        return this.contract.then(deployed => {
            const blockNumber = this.web3.eth.blockNumber;
            deployed.Confirmation({}, {}, (e, r) => {
                if (r.blockNumber > blockNumber) callback(r.args.operation);
            })
        });
    }
}

export default new PendingManagerDAO();