import AbstractContractDAO from './AbstractContractDAO'
import TIMEProxyDAO from './TIMEProxyDAO'

class TIMEHolderDAO extends AbstractContractDAO {
  approveAmount (amount: number) {
    return this.getAddress().then(address => {
      return TIMEProxyDAO.approve(address, amount)
    })
  }

  depositAmount (amount: number) {
    return this._tx('deposit', [this.converter.toLHT(amount)])
  }

  withdrawAmount (amount: number) {
    return this._tx('withdrawShares', [this.converter.toLHT(amount)])
  }

  getAccountDepositBalance (account: string) {
    return this._call('depositBalance', [account]).then(r => this.converter.fromLHT(r.toNumber()))
  }
}

export default new TIMEHolderDAO(require('chronobank-smart-contracts/build/contracts/TimeHolder.json'))
