import BigNumber from 'bignumber.js'
import axios from 'axios'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import TxExecModel from 'models/TxExecModel'
import TokenModel from 'models/tokens/TokenModel'
import TxModel from 'models/TxModel'
import networkService from '@chronobank/login/network/NetworkService'
import ls from 'utils/LocalStorage'
import TxError from 'models/TxError'
import AbstractContractDAO, { TX_FRONTEND_ERROR_CODES } from './AbstractContractDAO'
import AbstractTokenDAO, { TXS_PER_PAGE } from './AbstractTokenDAO'

export const TX_TRANSFER = 'transfer'

export class EthereumDAO extends AbstractTokenDAO {
  async getAccountBalance (account = this.getAccount()): BigNumber {
    const balance = await this._web3Provider.getBalance(account)
    return this._c.fromWei(balance)
  }

  isInitialized () {
    return true
  }

  getDecimals () {
    return 18
  }

  addDecimals (amount: BigNumber): BigNumber {
    return amount.mul(Math.pow(10, this.getDecimals()))
  }

  removeDecimals (amount: BigNumber): BigNumber {
    return amount.div(Math.pow(10, this.getDecimals()))
  }

  getSymbol () {
    return 'ETH'
  }

  static getName () {
    return 'Ethereum'
  }

  getToken () {
    if (!this.isInitialized()) {
      // eslint-disable-next-line
      console.warn(`${this._symbol} not initialized`)
      return
    }
    return new TokenModel({
      name: 'Ethereum',
      symbol: this.getSymbol(),
      isOptional: false,
      isFetched: true,
      blockchain: 'Ethereum',
      isERC20: true, //erc20-like
    })
  }

  /** @private */
  _getTxModel (tx, account, time = Date.now() / 1000): TxModel {
    const gasPrice = new BigNumber(tx.gasPrice)
    const gasFee = this._c.fromWei(gasPrice.mul(tx.gas))

    return new TxModel({
      txHash: tx.hash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      transactionIndex: tx.transactionIndex,
      from: tx.from,
      to: tx.to,
      value: this._c.fromWei(tx.value),
      time,
      gasPrice,
      gas: tx.gas,
      gasFee,
      input: tx.input,
      credited: tx.to === account,
      token: this.getSymbol(),
    })
  }

  async transfer (account, amount: BigNumber) {
    const value = this._c.toWei(amount)
    const txData = {
      from: this.getAccount(),
      to: account,
      value,
    }

    const [gasPrice, estimateGas] = await Promise.all([
      this._web3Provider.getGasPrice(),
      this._web3Provider.estimateGas({ to: account, value }),
    ])

    let tx = new TxExecModel({
      contract: EthereumDAO.getName(),
      func: TX_TRANSFER,
      value: amount,
      gas: this._c.fromWei(new BigNumber(estimateGas).mul(gasPrice)),
      args: {
        to: account,
        value: amount,
      },
    })
    AbstractContractDAO.txGas(tx)

    return new Promise(async (resolve, reject) => {
      try {
        await AbstractContractDAO.txStart(tx)

        let txHash
        const web3 = await this._web3Provider.getWeb3()
        let filter = web3.eth.filter('latest', async (e, blockHash) => {
          if (!filter) { // to prevent excess filter callbacks when we already caught tx
            return
          }
          const block = await this._web3Provider.getBlock(blockHash)
          const txs = block.transactions || []
          if (!txs.includes(txHash)) {
            return
          }

          filter.stopWatching(() => {
          })
          filter = null

          const [receipt, transaction] = await Promise.all([
            this._web3Provider.getTransactionReceipt(txHash),
            this._web3Provider.getTransaction(txHash),
          ])

          const gasUsed = this._c.fromWei(transaction.gasPrice.mul(receipt.gasUsed))
          tx = tx.setGas(gasUsed, true)
          AbstractContractDAO.txEnd(tx)

          resolve(true)
        }, (e) => {
          throw new TxError(e.message, TX_FRONTEND_ERROR_CODES.FRONTEND_WEB3_FILTER_FAILED)
        })

        txHash = await this._web3Provider.sendTransaction(txData)
        tx = tx.set('hash', txHash)
      } catch (e) {
        const error = this._txErrorDefiner(e)
        if (e.code !== TX_FRONTEND_ERROR_CODES.FRONTEND_CANCELLED) {
          // eslint-disable-next-line
          console.warn('Ethereum transfer error', error)
        }
        AbstractContractDAO.txEnd(tx, error)
        reject(error)
      }
    })
  }

  /** @inheritDoc */
  async watchTransfer (account, callback) {
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
      const time = block.timestamp * 1000
      if (time < startTime) {
        return
      }
      const txs = block.transactions || []
      txs.forEach((tx) => {
        if (tx.value.toNumber() > 0 && (tx.from === account || tx.to === account)) {
          this._transferCallback(new TransferNoticeModel({
            tx: this._getTxModel(tx, account),
            account,
            time,
          }))
        }
      })
    })
  }

  async getTransfer (id, account = this.getAccount()): Array<TxModel> {
    const apiURL = networkService.getScanner(ls.getNetwork(), ls.getProvider(), true)
    if (apiURL) {
      try {
        const test = await axios.get(`${apiURL}/api`)
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
    const toBlock = cache.toBlock || await this._web3Provider.getBlockNumber()
    const txs = cache.txs || []
    let page = cache.page || 1
    let end = cache.end || false

    while (txs.length < TXS_PER_PAGE && !end) {
      const url = `${apiURL}/api?module=account&action=txlist&address=${account}&startblock=0&endblock=${toBlock}&page=${page}&offset=${offset}&sort=desc`
      try {
        const result = await axios.get(url)
        if (typeof result !== 'object' || !result.data) {
          throw new Error('invalid result')
        }
        if (result.data.status !== '1') {
          throw new Error(`result not OK: ${result.data.message}`)
        }
        for (const tx of result.data.result) {
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

    this._setFilterCache(id, {
      toBlock, page, txs: txs.slice(TXS_PER_PAGE), end,
    })

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
        txs.forEach((tx) => {
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

  subscribeOnReset () {
    this._web3Provider.onResetPermanent(() => this.handleWeb3Reset())
  }

  handleWeb3Reset () {
    if (this.contract) {
      this.contract = this._initContract()
    }
  }
}

export default new EthereumDAO()
