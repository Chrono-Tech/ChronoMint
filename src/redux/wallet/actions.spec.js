import * as a from './actions'
import * as notifier from '../notifier/actions'
// import TIMEHolderDAO from '../../dao/TIMEHolderDAO'
import { store, accounts } from '../../specsInit'
import TxModel from '../../models/TxModel'
import TransferNoticeModel from '../../models/notices/TransferNoticeModel'
import { EXCHANGE_TRANSACTION } from '../exchange/actions'
import ls from '../../utils/LocalStorage'

const account = accounts[0]
const tx = new TxModel({txHash: 'abc', from: '0x0', to: '0x1'})

// const round2 = v => Math.round(v * 100) / 100

describe('wallet actions', () => {
  it('mock', () => {
    expect(true).toBeTruthy()
  })

  it.skip('should create a notice and dispatch tx', () => {
    const notice = new TransferNoticeModel({tx, account})
    store.dispatch(a.watchTransfer(notice, false))
    expect(store.getActions()).toEqual([
      {type: notifier.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice, isStorable: true},
      {type: a.WALLET_TRANSACTION, tx},
      {type: EXCHANGE_TRANSACTION, tx}
    ])
    expect(store.getActions()[0].notice).toEqual(notice)
    expect(store.getActions()[1].list.get(notice.id())).toEqual(notice)
  })

  it.skip('should update TIME balance', () => {
    // return store.dispatch(a.updateTIMEBalance(account)).then(() => {
    //   expect(store.getActions()[0]).toEqual({type: a.WALLET_BALANCE_TIME_FETCH})
    //   expect(store.getActions()[1].balance).toBeGreaterThanOrEqual(0)
    // })
  })

  it.skip('should update TIME deposit', () => {
    return store.dispatch(a.initTIMEDeposit()).then(() => {
      expect(store.getActions()[0].deposit).toBeGreaterThanOrEqual(0)
    })
  })

  it.skip('should transfer TIME', () => {
    // return TIMEProxyDAO.getAccountBalance(account).then(balance => {
    //   return TIMEProxyDAO.getAccountBalance(accounts[1]).then(recBalanceStart => {
    //     return store.dispatch(a.transferTIME('0.01', accounts[1])).then(() => {
    //       return TIMEProxyDAO.getAccountBalance(accounts[1]).then(recBalanceEnd => {
    //         expect(round2(store.getActions()[2].balance)).toEqual(round2(balance - 0.01))
    //         expect(round2(recBalanceStart)).toEqual(round2(recBalanceEnd - 0.01))
    //       })
    //     })
    //   })
    // })
  })

  it.skip('should deposit TIME', () => {
    // return TIMEProxyDAO.getAccountBalance(account).then(balance => {
    //   return TIMEHolderDAO.getAccountDepositBalance(account).then(deposit => {
    //     return store.dispatch(a.depositTIME('0.02')).then(() => {
    //       expect(round2(store.getActions()[3].deposit)).toEqual(round2(deposit + 0.02))
    //       expect(round2(store.getActions()[4].balance)).toEqual(round2(balance - 0.02))
    //     })
    //   })
    // })
  })

  it.skip('should withdraw TIME', () => {
    // return TIMEProxyDAO.getAccountBalance(account).then(balance => {
    //   return TIMEHolderDAO.getAccountDepositBalance(account).then(deposit => {
    //     return store.dispatch(a.withdrawTIME('0.02')).then(() => {
    //       expect(round2(store.getActions()[3].deposit)).toEqual(round2(deposit - 0.02))
    //       expect(round2(store.getActions()[4].balance)).toEqual(round2(balance + 0.02))
    //     })
    //   })
    // })
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
