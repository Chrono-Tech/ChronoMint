import AbstractContractDAO from './AbstractContractDAO'
import TIMEProxyDAO from './TIMEProxyDAO'

class TIMEHolderDAO extends AbstractContractDAO {
  approveAmount (amount: number, account: string) {
    return this.contract.then(deployed =>
      TIMEProxyDAO.approve(deployed.address, amount * 100, account)
    )
  }

  depositAmount (amount: number, account: string) {
    return this.contract.then(deployed =>
      deployed.deposit.call(amount * 100, {from: account, gas: 3000000}).then(r => {
        if (r) {
          return deployed.deposit(amount * 100, {from: account, gas: 3000000})
        }
        return false
      })
    )
  }

  withdrawAmount (amount: number, account: string) {
    return this.contract.then(deployed =>
      deployed.withdrawShares.call(amount * 100, {from: account}).then(r => {
        if (r) {
          return deployed.withdrawShares(amount * 100, {from: account, gas: 3000000})
        }
        return false
      })
    )
  }

  getAccountDepositBalance (account: string) {
    return this.contract.then(deployed => deployed.depositBalance(account)).then(r => r.toNumber() / 100)
  }
}

export default new TIMEHolderDAO(require('../contracts/TimeHolder.json'))
