/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import solidityEvent from 'web3/lib/web3/event'
import BigNumber from 'bignumber.js'
import Amount from '../models/Amount'
import TokenModel from '../models/tokens/TokenModel'
import TxModel from '../models/TxModel'
import AbstractTokenDAO from './AbstractTokenDAO'
import { EVENT_NEW_BLOCK } from './constants'
import TxDescModel from '../models/TxDescModel'

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

export class AbstractEthereumDAO extends AbstractTokenDAO {
  constructor (symbol, contractName, provider, ...rest) {
    super(...rest)

    this._decimals = 18
    this._symbol = symbol
    this._contractName = contractName
    this.provider = provider
  }

  connect (web3) {
    if (this.isConnected) {
      this.disconnect()
    }
    this.web3 = web3

    this.logsEmitter = this.web3.eth.subscribe('newBlockHeaders')
      .on('data', this.handleBlockData)
  }

  disconnect () {
    if (this.isConnected) {
      this.logsEmitter.removeAllListeners()
      this.logsEmitter = null
      this.web3 = null
    }
  }

  get isConnected () {
    return this.web3 != null // nil check
  }

  handleBlockData = async (event) => {
    const block = await this.web3.eth.getBlock(event.hash, true)
    setImmediate(() => {
      if (block && block.transactions) {
        this.emit(EVENT_NEW_BLOCK, { blockNumber: block.number })
        for (const tx of block.transactions) {
          this.emit('tx', tx)
        }
      }
    })
  }

  getGasPrice (): Promise {
    return this.web3.eth.getGasPrice()
  }

  getBlockNumber (): Promise {
    return this.web3.eth.getBlockNumber()
  }

  getAccountBalances (account): Promise {
    return this.provider.getAccountBalances(account)
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
    return new TokenModel({
      name: this._contractName, // ???
      symbol: this._symbol,
      isFetched: true,
      blockchain: this._contractName,
      decimals: this._decimals,
      isERC20: false,
    })
  }

  /** @private */
  _getTxModel (tx, time): TxModel {
    const gasPrice = tx.gasPrice && new BigNumber('' + tx.gasPrice)
    const gasFee = gasPrice && gasPrice.mul(tx.gas)

    return new TxDescModel({
      title: tx.details ? tx.details.event : 'tx.transfer',
      hash: tx.hash,
      time,
      blockchain: this._contractName,
      blockNumber: tx.blockNumber,
      value: new Amount(tx.value, tx.symbol || this._symbol),
      fee: new Amount(gasFee, this._symbol),
      from: tx.from,
      to: tx.to,
      params: [
        {
          name: 'from',
          value: tx.from,
        },
        {
          name: 'to',
          value: tx.to,
        },
        {
          name: 'amount',
          value: new Amount(tx.value, tx.symbol || this._symbol),
        },
      ],
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

  transfer (from: string, to: string, amount: Amount) {
    return {
      from,
      to,
      value: new BigNumber(amount),
    }
  }

  async getTransfer (id, account, skip, offset, tokens): Promise<TxModel> {
    const tokensMap = {}
    tokens.items().map((token) => {
      if (token.address()) {
        tokensMap[token.address()] = token.symbol()
      }
    })
    const txs = []
    try {
      const txsResult = await this.provider.getTransactionsList(account, skip, offset)
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
              const resultDecoded = new solidityEvent(null, signatureDefinition).decode(log)
              tx.from = resultDecoded.args.from
              tx.to = resultDecoded.args.to
              tx.value = resultDecoded.args.value
              tx.details = resultDecoded
            }
          })
          if (txToken) {
            tx.symbol = txToken
          }
        }

        txs.push(this._getTxModel(tx, tx.timestamp / 1000, tokens)) // convert milliseconds to seconds
      }
    } catch (e) {
      // eslint-disable-next-line
      console.warn('Middleware API is not available, fallback to block-by-block scanning', e)
    }
    return txs
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
