/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import solidityEvent from 'web3/lib/web3/event'
import BigNumber from 'bignumber.js'
import Amount from '../models/Amount'
import TokenModel from '../models/tokens/TokenModel'
import TxExecModel from '../models/TxExecModel'
import TxModel from '../models/TxModel'
import AbstractContractDAO from './AbstractContractDAO'
import AbstractTokenDAO from './AbstractTokenDAO'

//#region CONSTANTS

import {
  BLOCKCHAIN_ETHEREUM,
  EVENT_NEW_BLOCK,
  EVENT_NEW_TRANSFER,
} from './constants'
import {
  FETCH_NEW_BALANCE,
} from './constants/EthereumDAO'

//#endregion CONSTANTS

const transferSignature = '0x940c4b3549ef0aaff95807dc27f62d88ca15532d1bf535d7d63800f40395d16c'
const signatureDefinition = {
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "name": "from",
      "type": "address",
    },
    {
      "indexed": true,
      "name": "to",
      "type": "address",
    },
    {
      "indexed": false,
      "name": "value",
      "type": "uint256",
    },
  ],
  "name": "Transfer",
  "type": "event",
}

export class EthereumDAO extends AbstractTokenDAO {
  constructor () {
    super(...arguments)

    this._decimals = 18
    this._symbol = 'ETH'
    this._contractName = 'Ethereum'
  }

  connect (web3) {
    if (this.isConnected) {
      this.disconnect()
    }
    this.web3 = web3
  }

  disconnect () {
    if (this.isConnected) {
      this.web3 = null
    }
  }

  get isConnected () {
    return this.web3 != null // nil check
  }

  watch (accounts: Array<string>): Promise {
    return Promise.all([
      this.watchTransfer(accounts),
    ])
  }

  getGasPrice (): Promise {
    return this.web3.eth.getGasPrice()
  }

  getBlockNumber (): Promise {
    return this.web3.eth.getBlockNumber()
  }

  getAccountBalance (account): Promise {
    return this.web3.eth.getBalance(account)
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
      isFetched: true,
      blockchain: BLOCKCHAIN_ETHEREUM,
      decimals: this._decimals,
      isERC20: false,
      feeRate: this.web3.utils.toWei(this.web3.utils.fromWei(feeRate), 'gwei'), // gas price in gwei
    })
  }

  /** @private */
  _getTxModel (tx, time = Date.now() / 1000): TxModel {
    const gasPrice = tx.gasPrice && new BigNumber('' + tx.gasPrice)
    const gasFee = gasPrice && gasPrice.mul(tx.gas)

    return new TxModel({
      txHash: tx.hash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      transactionIndex: tx.transactionIndex,
      from: tx.from,
      to: tx.to,
      value: new Amount(tx.value, tx.symbol || this._symbol),
      time,
      gasPrice,
      gas: tx.gas,
      gasFee,
      input: tx.input,
      // TODO @dkchv: token ???
      token: tx.symbol || this._symbol,
      symbol: tx.symbol || this._symbol,
      blockchain: BLOCKCHAIN_ETHEREUM,
    })
  }

  estimateGas = async (func, args, value, from, additionalOptions): Object => {
    const feeMultiplier = additionalOptions ? additionalOptions.feeMultiplier : 1
    const [to, amount] = args

    const [gasPrice, gasLimit] = await Promise.all([
      this.web3.eth.getGasPrice(),
      this.web3.eth.estimateGas({ to, value: amount }),
    ])

    const gasPriceBN = new BigNumber(gasPrice).mul(feeMultiplier)
    const gasFeeBN = gasPriceBN.mul(gasLimit)
    const gasLimitBN = new BigNumber(gasLimit)

    return { gasLimit: gasLimitBN, gasFee: gasFeeBN, gasPrice: gasPriceBN }
  }

  async transfer (from: string, to: string, amount: Amount, token, feeMultiplier: Number = 1, advancedParams): Promise {
    this.submit(from, to, amount, token, feeMultiplier, advancedParams)
  }

  accept (transfer: TxExecModel) {
    setImmediate(() => {
      this.emit('accept', transfer)
    })
  }

  reject (transfer: TxExecModel) {
    setImmediate(() => {
      this.emit('reject', transfer)
    })
  }

  async submit (from, to, amount, token, feeMultiplier, advancedParams) {
    const { gasLimit, gasFee, gasPrice } = await this.estimateGas(null, [to, amount], amount, from, { feeMultiplier })
    const value = new Amount(amount, this._symbol)

    setImmediate(async () => {
      this.emit('submit', new TxExecModel({
        contract: this._contractName,
        func: 'transfer',
        blockchain: this._contractName,
        symbol: this._symbol,
        from,
        fields: {
          to: {
            value: to,
            description: 'to',
          },
          amount: {
            value: new Amount(amount, this._symbol),
            description: 'amount',
          },
        },
        value,
        to,
        additionalOptions: advancedParams,
        fee: {
          gasLimit: new Amount(gasLimit, this._symbol),
          gasFee: new Amount(gasFee, this._symbol),
          gasPrice: new Amount(gasPrice, this._symbol),
          feeMultiplier,
        },
      }))
    })
  }

  async immediateTransfer (tx: TxExecModel) {
    try {
      const rawTx = await this.createRawTx(tx)
      ethereumProvider.transfer(rawTx, tx.from)
    } catch (e) {
      // eslint-disable-next-line
      console.log('Transfer failed', e)
      throw e
    }
  }

  async watchTransfer (accounts) {
    const web3 = await this.web3.eth.getWeb3()
    const filter = web3.eth.filter('latest')
    const startTime = AbstractContractDAO._eventsWatchStartTime
    this._addFilterEvent(filter)
    filter.watch(async (e, r) => {
      if (e) {
        // eslint-disable-next-line
        console.error('EthereumDAO watchTransfer', e)
        return
      }
      const block = await this.web3.eth.getBlock(r, true)

      this.emit(EVENT_NEW_BLOCK, { blockNumber: block.blockNumber || block.number })

      const time = block.timestamp * 1000
      if (time < startTime) {
        return
      }
      const txs = block.transactions || []
      txs.forEach((tx) => {
        const condition = Array.isArray(accounts)
          ? accounts.includes(tx.from) || accounts.includes(tx.to)
          : accounts === tx.from || accounts === tx.to

        if (condition) {
          this.emit(FETCH_NEW_BALANCE)
          if (tx.value.toNumber() > 0) {
            this.emit(EVENT_NEW_TRANSFER, this._getTxModel(tx))
          }
        }
      })
    })
  }

  async getTransfer (id, account, skip, offset, tokens): Promise<TxModel> {
    let tokensMap = {}
    tokens.items().map((token) => {
      if (token.address()) {
        tokensMap[token.address()] = token.symbol()
      }
    })
    let txs = []
    try {
      const txsResult = await ethereumProvider.getTransactionsList(account, skip, offset)
      for (const tx of txsResult) {
        if (tx.logs.length > 0) {
          let txToken
          if (tokensMap[tx.from]) {
            txToken = tokensMap[tx.from]
          }
          if (tokensMap[tx.to]) {
            txToken = tokensMap[tx.to]
          }
          tx.logs.map((log) => {
            if (tokensMap[log.address]) {
              txToken = tokensMap[log.address]
            }
            if (log.signature === transferSignature) {
              let resultDecoded = new solidityEvent(null, signatureDefinition).decode(log)
              tx.from = resultDecoded.args.from
              tx.to = resultDecoded.args.to
              tx.value = resultDecoded.args.value
            }
          })
          if (txToken) {
            tx.symbol = txToken
          }
        }

        txs.push(this._getTxModel(tx, tx.timestamp, tokens))
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
    let [i, limit] = this._getFilterCache(id) || [await this.web3.eth.getBlockNumber(), 0]
    if (limit === 0) {
      limit = Math.max(i - 150, 0)
    }
    const result = []
    while (i >= limit) {
      try {
        const block = await this.web3.eth.getBlock(i, true)
        const txs = block.transactions || []
        txs.forEach((tx) => {
          if ((tx.to === account || tx.from === account) && tx.value > 0) {
            result.push(this._getTxModel(tx, block.timestamp))
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
    this.web3.eth.onResetPermanent(() => this.handleWeb3Reset())
  }

  handleWeb3Reset () {
    if (this.contract) {
      this.contract = this._initContract()
    }
  }
}

export default new EthereumDAO()
