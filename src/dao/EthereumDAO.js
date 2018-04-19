/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import BigNumber from 'bignumber.js'
import Amount from 'models/Amount'
import TokenModel from 'models/tokens/TokenModel'
import TxError from 'models/TxError'
import TxExecModel from 'models/TxExecModel'
import TxModel from 'models/TxModel'
import AbstractContractDAO, { DEFAULT_GAS, TX_FRONTEND_ERROR_CODES } from './AbstractContractDAO'
import AbstractTokenDAO, { EVENT_NEW_BLOCK, EVENT_NEW_TRANSFER, FETCH_NEW_BALANCE } from './AbstractTokenDAO'

export const TX_TRANSFER = 'transfer'

export const BLOCKCHAIN_ETHEREUM = 'Ethereum'

export class EthereumDAO extends AbstractTokenDAO {
  constructor () {
    super(...arguments)

    this._decimals = 18
    this._symbol = 'ETH'
    this._contractName = 'Ethereum'
  }

  watch (account): Promise {
    return Promise.all([
      this.watchTransfer(account),
    ])
  }

  getGasPrice (): Promise {
    return this._web3Provider.getGasPrice()
  }

  getBlockNumber (): Promise {
    return this._web3Provider.getBlockNumber()
  }

  getAccountBalance (account): Promise {
    return this._web3Provider.getBalance(account)
  }

  getContractName () {
    return this._contractName
  }

  addDecimals (amount: BigNumber): BigNumber {
    return amount.mul(Math.pow(10, this._decimals))
  }

  removeDecimals (amount: BigNumber): BigNumber {
    return amount.div(Math.pow(10, this._decimals))
  }

  getSymbol () {
    return this._symbol
  }

  async getToken () {
    const feeRate = await this.getGasPrice()
    return new TokenModel({
      name: 'Ethereum', // ???
      symbol: this._symbol,
      isOptional: false,
      isFetched: true,
      blockchain: BLOCKCHAIN_ETHEREUM,
      decimals: this._decimals,
      isERC20: false,
      feeRate: this._c.toWei(this._c.fromWei(feeRate), 'gwei'), // gas price in gwei
    })
  }

  /** @private */
  _getTxModel (tx, account, time = Date.now() / 1000): TxModel {
    // error "15 Significant digit limit"
    BigNumber.config({ ERRORS: false })
    const gasPrice = tx.gasPrice && new BigNumber(tx.gasPrice)
    const gasFee = gasPrice && gasPrice.mul(tx.gas)

    return new TxModel({
      txHash: tx.hash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      transactionIndex: tx.transactionIndex,
      from: tx.from,
      to: tx.to,
      value: new Amount(tx.value, this._symbol),
      time,
      gasPrice,
      gas: tx.gas,
      gasFee,
      input: tx.input,
      credited: tx.to === account,
      // TODO @dkchv: token ???
      token: this._symbol,
      symbol: this._symbol,
    })
  }

  async _estimateGas (to, value) {
    const [ gasPrice, gasLimit ] = await Promise.all([
      this._web3Provider.getGasPrice(),
      this._web3Provider.estimateGas({ to, value }),
    ])
    const gasPriceBN = new BigNumber(gasPrice)
    const gasFee = gasPriceBN.mul(gasLimit)

    return { gasLimit, gasFee, gasPrice: gasPriceBN }

  }

  async transfer (from: string, to: string, amount: Amount, token: TokenModel, feeMultiplier: Number): Promise {
    const value = new BigNumber(amount)
    const txData = {
      from,
      to,
      value,
    }

    /** ESTIMATE GAS */
    const estimateGas = (func, args, value) => {
      return this._estimateGas(args.to, value)
    }

    let tx = new TxExecModel({
      contract: this.getContractName(),
      func: TX_TRANSFER,
      value,
      gas: new BigNumber(0), // if gasMultiplier set in sendForm
      args: {
        from,
        to,
        value: amount,
        // value,
      },
      params: {
        to,
      },
    })
    AbstractContractDAO.txGas(tx)

    return new Promise(async (resolve, reject) => {
      try {
        tx = await AbstractContractDAO.txStart(tx, estimateGas, feeMultiplier)
        txData.gas = process.env.NODE_ENV === 'development' ? DEFAULT_GAS : tx.gasLimit()
        txData.gasPrice = tx.gasPrice()

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

          const [ receipt, transaction ] = await Promise.all([
            this._web3Provider.getTransactionReceipt(txHash),
            this._web3Provider.getTransaction(txHash),
          ])

          const gasUsed = transaction.gasPrice.mul(receipt.gasUsed)
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

  async watchTransfer (account) {
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

      this.emit(EVENT_NEW_BLOCK, { blockNumber: block.blockNumber })

      const time = block.timestamp * 1000
      if (time < startTime) {
        return
      }
      const txs = block.transactions || []
      txs.forEach((tx) => {
        if (tx.from === account || tx.to === account) {
          this.emit(FETCH_NEW_BALANCE)
          if (tx.value.toNumber() > 0) {
            this.emit(EVENT_NEW_TRANSFER, this._getTxModel(tx, account))
          }
        }
      })
    })
  }

  async getTransfer (id, account, skip, offset): Promise<TxModel> {
    let txs = []
    try {
      const txsResult = await ethereumProvider.getTransactionsList(account, skip, offset)
      for (const tx of txsResult) {
        if (!tx.value || tx.value === '0') {
          continue
        }
        txs.push(this._getTxModel(tx, account, tx.timestamp))
      }
    } catch (e) {
      // eslint-disable-next-line
      console.warn('Middleware API is not available, fallback to block-by-block scanning', e)
      return this._getTransferFromBlocks(account, id)
    }
    return txs
  }

  /**
   * Useful for TestRPC
   * @param account
   * @param id
   * @private
   */
  async _getTransferFromBlocks (account, id): Array<TxModel> {
    let [ i, limit ] = this._getFilterCache(id) || [ await this._web3Provider.getBlockNumber(), 0 ]
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
    this._setFilterCache(id, [ i, limit ])
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
