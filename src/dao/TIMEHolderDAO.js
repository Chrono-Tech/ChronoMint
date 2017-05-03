import AbstractContractDAO from './AbstractContractDAO'
import TIMEProxyDAO from './TIMEProxyDAO'

class TIMEHolderDAO extends AbstractContractDAO {
  approveAmount (amount: number) {
    return this.getAddress().then(address => {
      return TIMEProxyDAO.approve(address, amount)
    })
  }

  depositAmount (amount: number) {
    return this._tx('deposit', [amount * 100000000])
  }

  withdrawAmount (amount: number) {
    return this._tx('withdrawShares', [amount * 100000000])
  }

  getAccountDepositBalance (account: string) {
    return this._call('depositBalance', [account]).then(r => r.toNumber() / 100000000)
  }
}

export default new TIMEHolderDAO(require('chronobank-smart-contracts/build/contracts/TimeHolder.json'))
