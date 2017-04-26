import * as a from '../../../src/redux/wallet/actions'
import * as notifier from '../../../src/redux/notifier/notifier'
import TIMEProxyDAO from '../../../src/dao/TIMEProxyDAO'
import TIMEHolderDAO from '../../../src/dao/TIMEHolderDAO'
import { store } from '../../init'
import TransactionModel from '../../../src/models/TransactionModel'
import TransferNoticeModel from '../../../src/models/notices/TransferNoticeModel'
import web3Provider from '../../../src/network/Web3Provider'

let accounts, account, tx

describe('wallet actions', () => {
  beforeAll(done => {
    web3Provider.getWeb3().then(web3 => {
      accounts = web3.eth.accounts
      account = accounts[0]
      tx = new TransactionModel({txHash: 'abc', from: '0x0', to: '0x1'})
      done()
    })
  })

  it('should create a notice and dispatch tx', () => {
    const notice = new TransferNoticeModel({tx, account})
    store.dispatch(a.watchTransfer(notice, false))
    expect(store.getActions()).toEqual([
      {type: notifier.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
      {type: notifier.NOTIFIER_LIST, list: store.getActions()[1].list},
      {type: a.WALLET_TRANSACTION, tx}
    ])
    expect(store.getActions()[0].notice).toEqual(notice)
    expect(store.getActions()[1].list.get(notice.id())).toEqual(notice)
  })

  it('should update TIME balance', () => {
    return store.dispatch(a.updateTIMEBalance(account)).then(() => {
      expect(store.getActions()[0]).toEqual({type: a.WALLET_BALANCE_TIME_FETCH})
      expect(store.getActions()[1].balance).toBeGreaterThanOrEqual(0)
    })
  })

  it('should update TIME deposit', () => {
    return store.dispatch(a.updateTIMEDeposit(account)).then(() => {
      expect(store.getActions()[0].deposit).toBeGreaterThanOrEqual(0)
    })
  })

  it('should require TIME', () => {
    return store.dispatch(a.requireTIME(account)).then(() => {
      expect(store.getActions()[4].balance).toBeGreaterThan(0)
    })
  })

  it('should transfer TIME', () => {
    return TIMEProxyDAO.getAccountBalance(account).then(balance => {
      return TIMEProxyDAO.getAccountBalance(accounts[1]).then(recBalanceStart => {
        return store.dispatch(a.transferTIME(account, '0.01', accounts[1])).then(() => {
          return TIMEProxyDAO.getAccountBalance(accounts[1]).then(recBalanceEnd => {
            expect(store.getActions()[3]).toEqual({type: a.WALLET_BALANCE_TIME, balance: balance - 0.01})
            expect(recBalanceStart).toEqual(recBalanceEnd - 0.01)
          })
        })
      })
    })
  })

  it('should deposit TIME', () => {
    return TIMEProxyDAO.getAccountBalance(account).then(balance => {
      return TIMEHolderDAO.getAccountDepositBalance(account).then(deposit => {
        return store.dispatch(a.depositTIME('0.02', account)).then(() => {
          expect(store.getActions()[4].deposit).toEqual(deposit + 0.02)
          expect(store.getActions()[5].balance).toEqual(balance - 0.02)
        })
      })
    })
  })

  it('should withdraw TIME', () => {
    return TIMEProxyDAO.getAccountBalance(account).then(balance => {
      return TIMEHolderDAO.getAccountDepositBalance(account).then(deposit => {
        return store.dispatch(a.withdrawTIME('0.02', account)).then(() => {
          expect(store.getActions()[4].deposit).toEqual(deposit - 0.02)
          expect(store.getActions()[5].balance).toEqual(balance + 0.02)
        })
      })
    })
  })

  it.skip('should update LHT balance', () => {
    // TODO
  })

  it.skip('should update ContractsManager LHT balance', () => {
    // TODO
  })

  it.skip('should update ETH balance', () => {
    // TODO
  })

  it.skip('should transfer ETH', () => {
    // TODO
  })

  it.skip('should transfer LHT', () => {
    // TODO
  })

  it.skip('should get transactions by account', () => {
    // TODO
  })
})
