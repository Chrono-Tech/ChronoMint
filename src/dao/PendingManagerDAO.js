/* eslint new-cap: ["error", { "capIsNewExceptions": ["Confirmation", "Revoke"] }] */
import AbstractContractDAO from './AbstractContractDAO'

class PendingManagerDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('../contracts/PendingManager.json'), at)
  }

  hasConfirmed (confSign: string, checkingAccount: string) {
    return this.contract.then(deployed => deployed.hasConfirmed.call(confSign, checkingAccount))
  };

  pendingYetNeeded (confSign: string) {
    return this.contract.then(deployed => deployed.pendingYetNeeded.call(confSign))
      .then(r => r.toNumber())
  };

  pendingsCount () {
    return this.contract.then(deployed => deployed.pendingsCount.call())
      .then(r => r.toNumber())
  };

  pendingById (index: number) {
    return this.contract.then(deployed => deployed.pendingById.call(index))
  };

  getTxsType (confSign: string) {
    return this.contract.then(deployed => deployed.getTxsType.call(confSign))
  };

  getTxsData (confSign: string) {
    return this.contract.then(deployed => deployed.getTxsData.call(confSign))
  };

  revoke (confSign: string, account: string) {
    return this.contract.then(deployed => deployed.revoke(confSign, {from: account}))
  };

  confirm (confSign: string, account: string) {
    return this.contract.then(deployed => deployed.confirm(confSign, {from: account, gas: 3000000}))
  };

  confirmationGet (callback, filter = null) {
    return this.contract.then(deployed =>
      deployed.Confirmation({}, filter).get(callback))
  };

  // revokeGet = (callback, filter = null) => this.contract.then(deployed => deployed.Revoke({}, filter).get(callback));

  // revokeWatch = (callback, filter = null) => this.contract.then(deployed =>
  //     deployed.Revoke({}, filter, callback));
  //
  newRevokeOperationWatch (callback) {
    this.contract.then(deployed => {
      let blockNumber = null
      this.web3.eth.getBlockNumber((e, r) => {
        blockNumber = r
        deployed.Revoke({}, {}, (e, r) => {
          if (r.blockNumber > blockNumber) callback(r.args.operation)
        })
      })
    })
  }

  // confirmationWatch = (callback, filter = null) => this.contract.then(deployed =>
  //     deployed.Confirmation({}, filter, (e, r) => callback(r.args.operation)));
  //
  newConfirmationWatch (callback) {
    return this.contract.then(deployed => {
      let blockNumber = null
      this.web3.eth.getBlockNumber((e, r) => {
        blockNumber = r
        deployed.Confirmation({}, {}, (e, r) => {
          if (r.blockNumber > blockNumber) callback(r.args.operation)
        })
      })
    })
  }
}

export default new PendingManagerDAO()
