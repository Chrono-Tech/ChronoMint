import { Map } from 'immutable'
import AbstractTokenDAO from './AbstractTokenDAO'
import AbstractContractDAO from './AbstractContractDAO'
import LS from '../utils/LocalStorage'
import TransactionModel from '../models/TransactionModel'
import TransactionExecModel from '../models/TransactionExecModel'
import TransferNoticeModel from '../models/notices/TransferNoticeModel'
import web3Provider from '../network/Web3Provider'

class EthereumDAO extends AbstractTokenDAO {
  getAccountBalance (account) {
    return web3Provider.getBalance(account).then(balance => {
      return this._c.fromWei(balance.toNumber())
    })
  }

  isInitialized () {
    return true
  }

  getDecimals () {
    return 18
  }

  addDecimals (amount: number) {
    return amount
  }

  removeDecimals (amount: number) {
    return amount
  }

  getSymbol () {
    return 'ETH'
  }

  getName () {
    return this.getSymbol()
  }

  /**
   * @param tx
   * @param account
   * @param time
   * @returns {TransactionModel}
   * @private
   */
  _getTxModel (tx, account, time = Date.now() / 1000) {
    return new TransactionModel({
      txHash: tx.hash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      transactionIndex: tx.transactionIndex,
      from: tx.from,
      to: tx.to,
      value: this._c.fromWei(tx.value.toNumber()),
      time,
      gasPrice: tx.gasPrice,
      gas: tx.gas,
      input: tx.input,
      credited: tx.to === account,
      symbol: this.getSymbol()
    })
  }

  /**
   * @param amount
   * @param recipient
   * @returns {Promise.<TransferNoticeModel>}
   */
  transfer (amount, recipient) {
    const txData = {
      from: LS.getAccount(),
      to: recipient,
      value: this._c.toWei(parseFloat(amount, 10))
    }
    const tx = new TransactionExecModel({
      contract: 'Ethereum',
      func: 'transfer',
      value: amount
    })
    AbstractContractDAO.txStart(tx)

    return new Promise(async (resolve) => {
      try {
        const txHash = await web3Provider.sendTransaction(txData)
        const web3 = await web3Provider.getWeb3()
        let filter = web3.eth.filter('latest', async (e, blockHash) => {
          if (!filter) {
            return
          }
          const block = await web3Provider.getBlock(blockHash)
          const txs = block.transactions || []
          if (!txs.includes(txHash)) {
            return
          }
          const txData = await web3Provider.getTransaction(txHash)
          this._transferCallback(new TransferNoticeModel({
            tx: this._getTxModel(txData, LS.getAccount()),
            account: LS.getAccount()
          }), false)

          AbstractContractDAO.removeFilterEvent(filter)
          filter.stopWatching(() => {})
          filter = null
          resolve(true)
        }, (e) => {
          // new callback since web3 0.19
          console.error('--EthereumDAO#', e)
        })
        AbstractContractDAO.addFilterEvent(filter)
      } catch (e) {
        AbstractContractDAO.txEnd(tx.id(), e)
        throw new Error(e)
      }
    })
  }

  /** @inheritDoc */
  async watchTransfer (callback) {
    this._transferCallback = callback
    const web3 = await web3Provider.getWeb3()
    const filter = web3.eth.filter('latest')
    AbstractContractDAO.addFilterEvent(filter)
    filter.watch(async (e, r) => {
      if (e) {
        return
      }
      const block = await web3Provider.getBlock(r, true)
      const txs = block.transactions || []
      txs.forEach(tx => {
        if (tx.value.toNumber() > 0 && (tx.from === LS.getAccount() || tx.to === LS.getAccount())) {
          this._transferCallback(new TransferNoticeModel({
            tx: this._getTxModel(tx, LS.getAccount()),
            account: LS.getAccount()
          }), false)
        }
      })
    })
  }

  getTransfer (account, fromBlock, toBlock) {
    const callback = (block) => {
      return new Promise(resolve => {
        return web3Provider.getBlock(block, true).then(resolvedBlock => {
          let map = new Map()
          const txs = resolvedBlock.transactions || []
          txs.forEach(tx => {
            if ((tx.to === account || tx.from === account) && tx.value > 0) {
              const txModel: TransactionModel = this._getTxModel(tx, account, resolvedBlock.timestamp)
              map = map.set(txModel.id(), txModel)
            }
          })
          resolve(map)
        }).catch(e => {
          console.warn('getBlock error', e)
        })
      })
    }
    const promises = []
    let map = new Map()
    for (let i = fromBlock; i <= toBlock; i++) {
      promises.push(callback(i))
    }
    return new Promise(resolve => {
      Promise.all(promises).then(values => {
        values.forEach(txs => {
          map = map.merge(txs)
        })
        resolve(map)
      })
    })
  }
}

export default new EthereumDAO()
