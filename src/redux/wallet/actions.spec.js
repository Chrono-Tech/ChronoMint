import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import * as a from './actions'
import { notify } from 'redux/notifier/actions'
import { mockStore, store, accounts } from 'specsInit'
import ProfileModel from 'models/ProfileModel'
import TokenModel from 'models/TokenModel'
import TxModel from 'models/TxModel'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import lhtDAO from 'dao/LHTDAO'
import ethereumDAO from 'dao/EthereumDAO'
import web3Provider from 'network/Web3Provider'
import web3Converter from 'utils/Web3Converter'
import type TIMEHolderDAO from 'dao/TIMEHolderDAO'

const account1 = accounts[6]
const account2 = accounts[7]
let eth: TokenModel
let time: TokenModel
let lht: TokenModel

let amountToDeposit
let amountToDepositBN

let amountToTransferETHBN

let requiredTIMEBN
let amountToTransferTIMEBN

let amountToWithdraw
let amountToWithdrawBN

let timeHolderDAO: TIMEHolderDAO
let timeHolderAddress

let getStateTIME

describe('wallet actions', () => {

  beforeAll(() => {
    contractsManagerDAO.setAccount(account1)
  })

  it('should init watch', async () => {

    const get = (profileTokens = [], tokens = new Immutable.Map()) => (key) => {
      if (key === 'session') {
        return {profile: new ProfileModel(
          {tokens: profileTokens}
        )}
      }
      if (key === 'wallet') {
        return {tokens}
      }
    }
    let myStore = mockStore({get: get([await lhtDAO.getAddress()])})

    await myStore.dispatch(a.watchInitWallet())

    const tokens = myStore.getActions()[1].tokens
    eth = tokens.get(a.ETH)
    time = tokens.get(a.TIME)
    lht = tokens.get(lhtDAO.getSymbol())

    expect(eth instanceof TokenModel).toBeTruthy()
    expect(time instanceof TokenModel).toBeTruthy()
    expect(lht instanceof TokenModel).toBeTruthy()

    expect(eth.balance()).toEqual(new BigNumber(100))

    // test stop watching of previous tokens
    expect(lht.dao().getWatchedEvents().length).toEqual(3) // 1 approval + 2 transfer (income and outcome)
    myStore = mockStore({get: get([], tokens)})
    await myStore.dispatch(a.watchInitWallet())
    expect(lht.dao().getWatchedEvents().length).toEqual(0)
  })

  it('should transfer ETH', async () => {

    const account1Balance = await ethereumDAO.getAccountBalance()
    const account2Balance = await ethereumDAO.getAccountBalance('latest', account2)

    const amount = '1.574836253'
    amountToTransferETHBN = new BigNumber(amount)
    await store.dispatch(a.transfer(eth, amount, account2))

    expect(store.getActions()).toEqual([
      a.balanceMinus(amountToTransferETHBN, eth),
      a.balancePlus(amountToTransferETHBN, eth)
    ])

    const latestBlock = await web3Provider.getBlock('latest')
    const tx = await web3Provider.getTransaction(latestBlock.transactions[0])
    const gasUsed = new BigNumber(latestBlock.gasUsed)
    const gasFee = new BigNumber(web3Converter.fromWei(gasUsed.mul(tx.gasPrice)))

    expect(await ethereumDAO.getAccountBalance()).toEqual(account1Balance.minus(amountToTransferETHBN).minus(gasFee))
    expect(await ethereumDAO.getAccountBalance('latest', account2)).toEqual(account2Balance.plus(amountToTransferETHBN))
  })

  it('should require TIME', async () => {

    await store.dispatch(a.requireTIME())

    expect(store.getActions()).toEqual([
      {type: a.WALLET_IS_TIME_REQUIRED, value: true}
    ])
  })

  it('should transfer ERC20 tokens', async () => {

    const account1Balance = await time.dao().getAccountBalance()
    const account2Balance = await time.dao().getAccountBalance('latest', account2)

    time = time.setBalance(true, account1Balance)
    requiredTIMEBN = account1Balance

    const amount = '2.0438572'
    amountToTransferTIMEBN = new BigNumber(amount)
    await store.dispatch(a.transfer(time, amount, account2))

    expect(store.getActions()).toEqual([
      a.balanceMinus(amountToTransferTIMEBN, time),
      a.balancePlus(amountToTransferTIMEBN, time)
    ])

    expect(await time.dao().getAccountBalance()).toEqual(account1Balance.minus(amountToTransferTIMEBN))
    expect(await time.dao().getAccountBalance('latest', account2)).toEqual(account2Balance.plus(amountToTransferTIMEBN))
  })

  it('should approve ERC20 tokens', async () => {

    amountToDeposit = '3.9438273'
    timeHolderDAO = await contractsManagerDAO.getTIMEHolderDAO()
    timeHolderAddress = await timeHolderDAO.getAddress()
    await store.dispatch(a.approve(time, amountToDeposit, timeHolderAddress))

    expect(await time.dao().getAccountAllowance(timeHolderAddress)).toEqual(new BigNumber(amountToDeposit))
  })

  it('should deposit TIME and init TIME deposit', async () => {

    amountToDepositBN = new BigNumber(amountToDeposit)

    getStateTIME = {get: (key) => {
      if (key === 'wallet') {
        return {tokens: new Immutable.Map({[a.TIME]: time})}
      }
    }}

    const myStore = mockStore(getStateTIME)

    await myStore.dispatch(a.depositTIME(amountToDeposit))
    await myStore.dispatch(a.initTIMEDeposit(amountToDeposit))

    expect(myStore.getActions()).toEqual([
      a.balanceMinus(amountToDepositBN, time),
      a.balancePlus(amountToDepositBN, time),
      a.updateDeposit(amountToDepositBN, null)
    ])
  })

  it('should withdraw TIME', async () => {

    amountToWithdraw = '0.378426'
    amountToWithdrawBN = new BigNumber(amountToWithdraw)

    await store.dispatch(a.withdrawTIME(amountToWithdraw))

    expect(store.getActions()).toEqual([
      a.depositMinus(amountToWithdrawBN),
      a.depositPlus(amountToWithdrawBN)
    ])

    expect(await timeHolderDAO.getAccountDepositBalance()).toEqual(amountToDepositBN.minus(amountToWithdrawBN))
  })

  it('should watch transfer, update balance & deposit & allowance, notify and add tx to list', async () => {

    const isCredited = false
    const value = new BigNumber('1.483729')
    const tx = new TxModel({
      to: timeHolderAddress,
      credited: isCredited,
      value,
      symbol: time.symbol()
    })
    const notice = new TransferNoticeModel({tx})

    const myStore = mockStore(getStateTIME)
    await myStore.dispatch(a.watchTransfer(notice))

    expect(myStore.getActions()).toEqual([
      a.updateBalance(time, isCredited, value),
      a.depositPlus(value),
      a.allowance(time, new BigNumber(0), timeHolderAddress),
      notify(notice),
      {type: a.WALLET_TRANSACTION, tx}
    ])
  })

  it('should get transactions by account', async () => {

    await store.dispatch(a.getAccountTransactions(new Immutable.Map({
      [a.ETH]: eth,
      [a.TIME]: time,
      [lhtDAO.getSymbol()]: lht
    })))

    const txs: Array<TxModel> = store.getActions()[1].map.valueSeq().toArray()

    expect(txs[0].value()).toEqual(amountToWithdrawBN)
    expect(txs[1].value()).toEqual(amountToDepositBN)
    expect(txs[2].value()).toEqual(amountToTransferTIMEBN)
    expect(txs[3].value()).toEqual(requiredTIMEBN)
    expect(txs[4].value()).toEqual(amountToTransferETHBN)
  })

  afterAll(() => {
    contractsManagerDAO.setAccount(accounts[0])
  })
})
