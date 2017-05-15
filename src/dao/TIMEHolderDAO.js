import AbstractContractDAO from './AbstractContractDAO'
import TIMEProxyDAO from './TIMEProxyDAO'

export const TX_DEPOSIT = 'deposit'
export const TX_WITHDRAW_SHARES = 'withdrawShares'

class TIMEHolderDAO extends AbstractContractDAO {
  approveAmount (amount: number) {
    return this.getAddress().then(address => {
      return TIMEProxyDAO.approve(address, amount)
    })
  }

  depositAmount (amount: number) {
    return this._tx(TX_DEPOSIT, [amount * 100000000], {amount})
  }

  withdrawAmount (amount: number) {
    return this._tx(TX_WITHDRAW_SHARES, [amount * 100000000], {amount})
  }

  getAccountDepositBalance (account: string) {
    return this._call('depositBalance', [account]).then(r => r.toNumber() / 100000000)
  }
}

export default new TIMEHolderDAO(require('chronobank-smart-contracts/build/contracts/TimeHolder.json'))
