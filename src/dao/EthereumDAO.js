import axios from 'axios'

import AbstractContractDAO, { TxError, TX_FRONTEND_ERROR_CODES } from './AbstractContractDAO'
import AbstractTokenDAO, { TXS_PER_PAGE } from './AbstractTokenDAO'

import TxModel from '../models/TxModel'
import TxExecModel from '../models/TxExecModel'
import TransferNoticeModel from '../models/notices/TransferNoticeModel'

import ls from '../utils/LocalStorage'
import { getScannerById } from '../network/settings'

class EthereumDAO extends AbstractTokenDAO {
  getAccountBalance (account, block = 'latest') {
    return this._web3Provider.getBalance(account, block).then(balance => {
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

  /** @private */
  _getTxModel (tx, account, time = Date.now() / 1000): TxModel {
    return new TxModel({
      txHash: tx.hash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      transactionIndex: tx.transactionIndex,
      from: tx.from,
      to: tx.to,
      value: this._c.fromWei(isNaN(tx.value) ? tx.value.toNumber() : tx.value),
      time,
      gasPrice: tx.gasPrice,
      gas: tx.gas,
      input: tx.input,
      credited: tx.to === account,
      symbol: this.getSymbol()
    })
  }

  async transfer (account: string, amount: number): Promise<TransferNoticeModel> { // TODO @bshevchenko: improve
    const value = this._c.toWei(parseFloat(amount, 10))
    const gasPrice = await this._web3Provider.getGasPrice()
    const txData = {
      from: ls.getAccount(),
      to: account,
      value
    }
    const estimateGas = await this._web3Provider.estimateGas({to: account, value})
    const tx = new TxExecModel({
      contract: 'Ethereum',
      func: 'transfer',
      value: amount,
      gas: this._c.fromWei(estimateGas * gasPrice.toNumber()),
      args: {
        from: ls.getAccount(),
        to: account,
        value: amount
      }
    })
    return new Promise(async (resolve, reject) => {
      try {
        await AbstractContractDAO.txStart(tx)

        const txHash = await this._web3Provider.sendTransaction(txData)
        const web3 = await this._web3Provider.getWeb3()
        // TODO @bshevchenko: what if filter will not find tx?
        let filter = web3.eth.filter('latest', async (e, blockHash) => {
          if (!filter) { // to prevent excess filter callbacks when we already caught tx
            return
          }
          const block = await this._web3Provider.getBlock(blockHash)
          const txs = block.transactions || []
          if (!txs.includes(txHash)) {
            return
          }

          filter.stopWatching(() => {})
          filter = null

          const txData = await this._web3Provider.getTransaction(txHash)
          this._transferCallback(new TransferNoticeModel({
            tx: this._getTxModel(txData, ls.getAccount()),
            account: ls.getAccount()
          }), false)

          AbstractContractDAO.txEnd(tx)

          resolve(true)
        }, (e) => {
          throw new TxError(e.message, TX_FRONTEND_ERROR_CODES.FRONTEND_WEB3_FILTER_FAILED)
        })
      } catch (e) {
        const error = this._txErrorDefiner(e)
        // eslint-disable-next-line
        console.warn('Ethereum transfer error', error)
        AbstractContractDAO.txEnd(tx, error)
        reject(error)
      }
    })
  }

  /** @inheritDoc */
  async watchTransfer (callback) {
    this._transferCallback = callback
    const web3 = await this._web3Provider.getWeb3()
    const filter = web3.eth.filter('latest')
    const startTime = AbstractContractDAO._eventsWatchStartTime
    this._addFilterEvent(filter)
    filter.watch(async (e, r) => {
      if (e) {
        // eslint-disable-next-line
        console.error('EthereumDAO watchTransfer', e)
        return
      }
      const block = await this._web3Provider.getBlock(r, true)
      if (block.timestamp * 1000 < startTime) {
        return
      }
      const txs = block.transactions || []
      txs.forEach(tx => {
        if (tx.value.toNumber() > 0 && (tx.from === ls.getAccount() || tx.to === ls.getAccount())) {
          this._transferCallback(new TransferNoticeModel({
            tx: this._getTxModel(tx, ls.getAccount()),
            account: ls.getAccount()
          }), false)
        }
      })
    })
  }

  async watchPending (callback) {
    const web3 = await this._web3Provider.getWeb3()
    const filter = web3.eth.filter('pending')
    this._addFilterEvent(filter)
    filter.watch(async (e) => {
      if (e) {
        // eslint-disable-next-line
        console.error('EthereumDAO watchPending', e)
        return
      }
      callback()
    })
  }

  async getTransfer (account, id): Array<TxModel> {
    const apiURL = getScannerById(ls.getNetwork(), ls.getProvider(), true)
    if (apiURL) {
      try {
        const test = await axios.get(apiURL + '/api')
        if (test.status === 200) {
          return this._getTransferFromEtherscan(apiURL, account, id)
        }
      } catch (e) {
        // eslint-disable-next-line
        console.warn('Etherscan API is not available, fallback to block-by-block scanning', e)
      }
    } else {
      // eslint-disable-next-line
      console.warn('Etherscan API is not available for selected provider, enabled block-by-block scanning for ETH txs')
    }
    return this._getTransferFromBlocks(account, id)
  }

  async _getTransferFromEtherscan (apiURL, account, id): Array<TxModel> {
    const offset = 10000 // limit of Etherscan
    const cache = this._getFilterCache(id) || {}
    const toBlock = cache['toBlock'] || await this._web3Provider.getBlockNumber()
    let txs = cache['txs'] || []
    let page = cache['page'] || 1
    let end = cache['end'] || false

    while (txs.length < TXS_PER_PAGE && !end) {
      const url = apiURL + `/api?module=account&action=txlist&address=${account}&startblock=0&endblock=${toBlock}&page=${page}&offset=${offset}&sort=desc`
      try {
        const result = await axios.get(url)
        if (typeof result !== 'object' || !result.data) {
          throw new Error('invalid result')
        }
        if (result.data.status !== '1') {
          throw new Error('result not OK: ' + result.data.message)
        }
        for (let tx of result.data.result) {
          if (tx.value === '0') {
            continue
          }
          txs.push(this._getTxModel(tx, account, tx.timeStamp))
        }
      } catch (e) {
        end = true
        // eslint-disable-next-line
        console.warn('EthereumDAO getTransfer Etherscan', e)
      }
      page++
    }

    this._setFilterCache(id, {toBlock, page, txs: txs.slice(TXS_PER_PAGE), end})

    return txs.slice(0, TXS_PER_PAGE)
  }

  /**
   * Useful for TestRPC
   * @param account
   * @param id
   * @private
   */
  async _getTransferFromBlocks (account, id): Array<TxModel> {
    let [i, limit] = this._getFilterCache(id) || [await this._web3Provider.getBlockNumber(), 0]
    if (limit === 0) {
      limit = Math.max(i - 150, 0)
    }
    const result = []
    while (i >= limit) {
      try {
        const block = await this._web3Provider.getBlock(i, true)
        const txs = block.transactions || []
        txs.forEach(tx => {
          if ((tx.to === account || tx.from === account) && tx.value > 0) {
            result.push(this._getTxModel(tx, account, block.timestamp))
          }
        })
      } catch (e) {
        // eslint-disable-next-line
        console.warn(e)
      }
      i--
    }
    this._setFilterCache(id, [i, limit])
    return result
  }
}

export default new EthereumDAO()
