import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import MainWallet from 'models/Wallet/MainWalletModel'
import { DUCK_SESSION } from 'redux/session/actions'
import { mockStore, store, accounts } from 'specsInit'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ethereumDAO from 'dao/EthereumDAO'
import lhtDAO from 'dao/LHTDAO'
import type TIMEHolderDAO from 'dao/TIMEHolderDAO'
import ProfileModel from 'models/ProfileModel'
import TokenModel from 'models/TokenModel'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import TxModel from 'models/TxModel'
import * as a from './actions'

const account1 = accounts[6]
const account2 = accounts[7]
let eth: TokenModel
let time: TokenModel
let lht: TokenModel
const amountToDeposit = '3.9438273'
const amountToTransferETH = '1.57483625'
const amountToTransferTIME = '2.0438572'
const amountToTransferTIMEBN = new BigNumber(amountToTransferTIME)
const amountToWithdraw = '0.378426'
let timeHolderDAO: TIMEHolderDAO
let timeHolderAddress
let getStateTIME

describe('wallet actions', () => {
  beforeAll(() => {
    contractsManagerDAO.setAccount(account1)
  })

  it('should check setBalance', () => {
    const token = new TokenModel({})
    const amount = new BigNumber(100)
    expect(a.setBalance(token, amount)).toMatchSnapshot()
  })

  it('should check updateBalance', () => {
    const token = new TokenModel({})
    const amount = new BigNumber(100)
    const isCredited = false
    expect(a.updateBalance(token, isCredited, amount)).toMatchSnapshot()
  })

  it('should check balancePlus', () => {
    const token = new TokenModel({})
    const amount = new BigNumber(100)
    expect(a.balancePlus(amount, token)).toMatchSnapshot()
  })

  it('should check balanceMinus', () => {
    const token = new TokenModel({})
    const amount = new BigNumber(100)
    expect(a.balancePlus(amount, token)).toMatchSnapshot()
  })

  it('should check updateDeposit', () => {
    const amount = new BigNumber(100)
    const isCredited = false
    expect(a.updateDeposit(isCredited, amount)).toMatchSnapshot()
  })

  it('should check depositPlus', () => {
    const amount = new BigNumber(100)
    expect(a.depositPlus(amount)).toMatchSnapshot()
  })

  it('should check depositMinus', () => {
    const amount = new BigNumber(100)
    expect(a.depositMinus(amount)).toMatchSnapshot()
  })

  it('should check allowance', () => {
    const token = new TokenModel({})
    const value = new BigNumber(100)
    const spender = ''
    expect(a.allowance(token, value, spender)).toMatchSnapshot()
  })

  it('should init watch', async () => {
    const get = (profileTokens = [], tokens = new Immutable.Map()) => (key) => {
      if (key === DUCK_SESSION) {
        return { profile: new ProfileModel({ tokens: profileTokens }) }
      }
      if (key === a.DUCK_MAIN_WALLET) {
        return new MainWallet({ tokens: new Immutable.Map(tokens) })
      }
    }
    let myStore = mockStore({
      get: get([await lhtDAO.getAddress()]),
    })

    await myStore.dispatch(a.watchInitWallet())

    const tokens = myStore.getActions()[1].tokens
    eth = tokens.get(a.ETH)
    time = tokens.get(a.TIME)
    lht = tokens.get(a.LHT)

    expect(eth instanceof TokenModel).toMatchSnapshot()
    expect(time instanceof TokenModel).toMatchSnapshot()
    expect(lht instanceof TokenModel).toMatchSnapshot()

    expect(eth.balance()).toMatchSnapshot()

    // test stop watching of previous tokens
    expect(lht.dao().getWatchedEvents().length).toMatchSnapshot()
    myStore = mockStore({ get: get([], tokens) })
    await myStore.dispatch(a.watchInitWallet())
    expect(lht.dao().getWatchedEvents().length).toMatchSnapshot()
  })

  it.skip('should transfer ETH', async () => {
    const account1Balance = await ethereumDAO.getAccountBalance(account1)
    const account2Balance = await ethereumDAO.getAccountBalance(account2)

    expect(account1Balance.toNumber()).toMatchSnapshot()
    expect(account2Balance.toNumber()).toMatchSnapshot()

    await store.dispatch(a.mainTransfer(eth, amountToTransferETH, account2))
    const actions = store.getActions()
    expect(actions).toMatchSnapshot()

    expect(await ethereumDAO.getAccountBalance()).toMatchSnapshot()
    expect(await ethereumDAO.getAccountBalance(account2)).toMatchSnapshot()
  })

  it('should require TIME', async () => {
    const balanceBefore = await time.dao().getAccountBalance()
    expect(balanceBefore.toNumber()).toMatchSnapshot()

    await store.dispatch(a.requireTIME())

    expect(store.getActions()).toMatchSnapshot()

    const balanceAfter = await time.dao().getAccountBalance()
    expect(balanceAfter.toNumber()).toMatchSnapshot()
  })

  it.skip('should transfer ERC20 tokens', async () => {
    const account1Balance = await time.dao().getAccountBalance()
    const account2Balance = await time.dao().getAccountBalance(account2)

    expect(account1Balance.toNumber()).toMatchSnapshot()
    expect(account2Balance.toNumber()).toMatchSnapshot()

    time = time.setBalance(account1Balance)

    await store.dispatch(a.mainTransfer(time, amountToTransferTIMEBN, account2))

    expect(store.getActions()).toMatchSnapshot()
    expect(await time.dao().getAccountBalance()).toMatchSnapshot()
    expect(await time.dao().getAccountBalance(account2)).toEqualtoMatchSnapshot()
  })

  it('should approve ERC20 tokens', async () => {
    timeHolderDAO = await contractsManagerDAO.getTIMEHolderDAO()
    timeHolderAddress = await timeHolderDAO.getWalletAddress()
    await store.dispatch(a.mainApprove(time, amountToDeposit, timeHolderAddress))

    expect(await time.dao().getAccountAllowance(timeHolderAddress)).toMatchSnapshot()
  })

  it.skip('should deposit TIME and init TIME deposit', async () => {
    getStateTIME = {
      get: (key) => {
        if (key === a.DUCK_MAIN_WALLET) {
          return new MainWallet({ tokens: new Immutable.Map({ [a.TIME]: time }) })
        }
      },
    }

    const myStore = mockStore(getStateTIME)

    await myStore.dispatch(a.depositTIME(amountToDeposit))
    await myStore.dispatch(a.initTIMEDeposit())

    expect(myStore.getActions()).toMatchSnapshot()
  })

  it.skip('should withdraw TIME', async () => {
    await store.dispatch(a.withdrawTIME(amountToWithdraw))
    expect(store.getActions()).toMatchSnapshot()
    expect(await timeHolderDAO.getAccountDepositBalance()).toMatchSnapshot()
  })

  it.skip('should watch transfer, update balance & deposit & allowance, notify and add tx to list', async () => {
    const isCredited = false
    const value = new BigNumber('1.483729')
    const tx = new TxModel({
      to: timeHolderAddress,
      credited: isCredited,
      value,
      symbol: time.symbol(),
    })
    const notice = new TransferNoticeModel({ tx })

    const myStore = mockStore(getStateTIME)
    await myStore.dispatch(a.watchTransfer(notice))

    expect(myStore.getActions()).toMatchSnapshot()
  })

  it('should get transactions by account', async () => {
    await store.dispatch(a.getAccountTransactions(new Immutable.Map({
      [a.ETH]: eth,
      [a.TIME]: time,
      [a.LHT]: lht,
    })))

    const txs: Array<TxModel> = store.getActions()[1].map.valueSeq().toArray()

    expect(txs[0].value()).toMatchSnapshot()
  })

  afterAll(() => {
    contractsManagerDAO.setAccount(accounts[0])
  })
})
