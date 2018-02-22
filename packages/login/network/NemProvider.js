import axios from 'axios'
import networkService from '@chronobank/login/network/NetworkService'
import BigNumber from 'bignumber.js'
import TxModel from 'models/TxModel'
import AbstractProvider from './AbstractProvider'
import { NemBalance, NemTx } from './NemAbstractNode'
import { selectNemNode } from './NemNode'
import { LOCAL_ID, MIDDLEWARE_MAP, NETWORK_MAIN_ID } from './settings'

export class NemProvider extends AbstractProvider {
  constructor () {
    super(...arguments)
    this._handleTransaction = (tx) => this.onTransaction(tx)
    this._handleBalance = (balance) => this.onBalance(balance)
    this._id = 'NEM'
  }

  subscribe (engine) {
    const node = super.subscribe(engine)
    node.addListener('tx', this._handleTransaction)
    node.addListener('balance', this._handleBalance)
  }

  unsubscribe (engine) {
    const node = super.unsubscribe(engine)
    node.removeListener('tx', this._handleTransaction)
    node.removeListener('balance', this._handleBalance)
  }

  async getTransactionInfo (txid) {
    const node = this._selectNode(this._engine)
    return node.getTransactionInfo(txid)
  }

  async getFeeRate () {
    const node = this._selectNode(this._engine)
    return node.getFeeRate()
  }

  getMosaics () {
    const node = this._selectNode(this._engine)
    return node.getMosaics() || []
  }

  getPrivateKey () {
    return this._engine ? this._engine.getPrivateKey() : null
  }

  async getAccountBalances (mosaic = null) {
    const node = this._selectNode(this._engine)
    const { balance, mosaics } = await node.getAddressInfo(this._engine.getAddress())
    if (mosaic) {
      return (mosaics && (mosaic in mosaics))
        ? mosaics[ mosaic ]
        : { confirmed: new BigNumber(0) } // When no such mosaic specified
    }
    return balance
  }

  async getTransactionsList (address, skip, offset) {

    const { network } = networkService.getProviderSettings()
    const links = MIDDLEWARE_MAP.txHistory[ `${this._id}`.toLowerCase() ]

    let apiURL = ''
    switch (network.id) {
      case NETWORK_MAIN_ID:
        apiURL = links.mainnet
        break
      case LOCAL_ID:
        apiURL = links.local
        break
      default:
        apiURL = links.testnet
    }
    if (apiURL) {
      try {
        const test = await axios.get(`${apiURL}/tx/${address}/history?skip=0&limit=1`)
        if (test.status === 200) {
          return this._getTransferFromMiddleware(apiURL, address, skip, offset)
        }
      } catch (e) {
        // eslint-disable-next-line
        console.warn('Middleware API is not available, fallback to block-by-block scanning', e)
      }
    }

    return []
  }

  async _getTransferFromMiddleware (apiURL: string, account: string, skip: number, offset: number): Array<TxModel> {
    let txs = []
    const url = `${apiURL}/tx/${account}/history?skip=${skip}&limit=${offset}`
    try {
      const result = await axios.get(url)
      if (typeof result !== 'object' || !result.data) {
        throw new Error('invalid result')
      }
      if (result.status !== 200) {
        throw new Error(`result not OK: ${result.data.message}`)
      }
      for (const tx of result.data) {
        txs.push(this._createTxModel(tx, account))
      }
    } catch (e) {
      // eslint-disable-next-line
      console.warn('EthereumDAO getTransfer Middleware', e)
    }

    return txs
  }

  // eslint-disable-next-line
  async transfer (from: string, to: string, amount: BigNumber, mosaicDefinition, feeMultiplier: Number) {
    // TODO @ipavlenko: Implement for XEM and Mosaics
    const node = this._selectNode(this._engine)
    const { tx /*, fee*/ } = this._engine.createTransaction(to, amount, mosaicDefinition, feeMultiplier)
    return node.send(from, tx)
  }

  async onTransaction (tx: NemTx) {
    this.emit('tx', {
      account: this.getAddress(),
      time: new Date().getTime(),
      tx,
    })
  }

  async onBalance (balance: NemBalance) {
    this.emit('balance', {
      account: this.getAddress(),
      time: new Date().getTime(),
      balance, // structured for NEM
    })
  }
}

export const nemProvider = new NemProvider(selectNemNode)
