/*eslint new-cap: ["error", { "capIsNewExceptions": ["Confirmation", "Revoke"] }]*/
import AbstractContractDAO from './AbstractContractDAO';

class AppDAO extends AbstractContractDAO {
    getLOCCount = (account: string) => {
        return this.contract.then(deployed => deployed.getLOCCount.call({from: account}));
    };

    getLOCbyID = (index: number, account: string) => {
        return this.contract.then(deployed => deployed.getLOCbyID.call({index, from: account}));
    };

    getLOCs = (account: string) => {
        return this.contract.then(deployed => deployed.getLOCs.call({from: account}));
    };

    pendingsCount = (account: string) => {
        return this.contract.then(deployed => deployed.pendingsCount.call({from: account}));
    };

    pendingById = (index: number, account: string) => {
        return this.contract.then(deployed => deployed.pendingById.call(index, {from: account}));
    };

    getTxsType = (conf_sign: string, account: string) => {
        return this.contract.then(deployed => deployed.getTxsType.call(conf_sign, {from: account}));
    };

    getTxsData = (conf_sign: string, account: string) => {
        return this.contract.then(deployed => deployed.getTxsData.call(conf_sign, {from: account}));
    };

    pendingYetNeeded = (conf_sign: string, account: string) => {
        return this.contract.then(deployed => deployed.pendingYetNeeded.call(conf_sign, {from: account}));
    };

    hasConfirmed = (conf_sign: string, checkingAccount: string, fromAccount: string) => {
        return this.contract.then(deployed => deployed.hasConfirmed.call(conf_sign, checkingAccount, {from: fromAccount}));
    };

    required = (account: string) => {
        return this.contract.then(deployed => deployed.required.call({from: account}));
    };

    revoke = (conf_sign: string, account: string) => {
        return this.contract.then(deployed => deployed.revoke(conf_sign, {from: account}));
    };

    confirm = (conf_sign: string, account: string) => {
        return this.contract.then(deployed => deployed.confirm(conf_sign, {from: account, gas: 3000000}));
    };

    setLOCString = (address: string, index: number, value: string, account: string) => {
        return this.contract.then(deployed => deployed.setLOCString(address, index, value, {from: account}));
    };

    setLOCValue = (address: string, index: number, value: number, account: string) => {
        return this.contract.then(deployed => deployed.setLOCValue(address, index, value, {
            from: account,
            gas: 3000000
        }));
    };

    proposeLOC = (locName: string, website: string, issueLimit: number, publishedHash: string,
                  expDate: number, account: string) => {
        return this.contract.then(deployed =>
            deployed.proposeLOC(locName, website, issueLimit, publishedHash, expDate, {
                from: account,
                gas: 3000000
            })
        );
    };

    removeLOC = (address: string, account: string) => {
        return this.contract.then(deployed => deployed.removeLOC(address, {from: account, gas: 3000000}));
    };

    newLOCWatch = callback => this.contract.then(deployed => {
        const blockNumber = this.web3.eth.blockNumber;
        deployed.newLOC({}, {}, (e, r) => {
            if (r.blockNumber > blockNumber) callback(r.args._LOC);
        });
    });


    // confirmationWatch = (callback, filter = null) => this.contract.then(deployed =>
    //     deployed.Confirmation({}, filter, (e, r) => callback(r.args.operation)));
    //
    newConfirmationWatch = (callback) => this.contract.then(deployed => {
        const blockNumber = this.web3.eth.blockNumber;
        deployed.Confirmation({}, {}, (e, r) => {
            if (r.blockNumber > blockNumber) callback(r.args.operation);
        })
    });

    // revokeWatch = (callback, filter = null) => this.contract.then(deployed =>
    //     deployed.Revoke({}, filter, callback));
    //
    newRevokeWatch = (callback) => this.contract.then(deployed => {
        const blockNumber = this.web3.eth.blockNumber;
        deployed.Revoke({}, {}, (e, r) => {
            if (r.blockNumber > blockNumber) callback(r.args.operation);
        })
    });

    confirmationGet = (callback, filter = null) => this.contract.then(deployed =>
        deployed.Confirmation({}, filter).get(callback));

    revokeGet = (callback, filter = null) => this.contract.then(deployed => deployed.Revoke({}, filter).get(callback));
}

export default new AppDAO(require('../contracts/ChronoMint.json'));