import TxModel from 'models/TxModel'
import AbstractNode from './AbstractNode'

export default class EthereumMiddlewareNode extends AbstractNode {
  constructor () {
    super(...arguments)
    this.addListener('subscribe', (address) => this._handleSubscribe(address))
    this.addListener('unsubscribe', (address) => this._handleUnsubscribe(address))
  }

  async _handleSubscribe ({ ethAddress, nemAddress }) {
    if (!this._socket) {
      return
    }
    try {
      await this._api.post('addr', {
        address: ethAddress,
        nem: nemAddress,
      })
    } catch (e) {
      this.trace('Address subscription error', e)
    }
  }

  async _handleUnsubscribe ({ ethAddress, nemAddress }) {
    try {
      await this._api.delete('addr', {
        address: ethAddress,
        nem: nemAddress,
      })
    } catch (e) {
      this.trace('Address unsubscription error', e)
    }
  }

  async getTransactionsList (address, id, skip, offset) {

    try {
      const test = await this._api.get(`tx/${address}/history?skip=0&limit=1`)
      if (test.status === 200) {
        return this._getTransferFromMiddleware(address, skip, offset)
      }
    } catch (e) {
      // eslint-disable-next-line
      console.warn('Middleware API is not available, fallback to block-by-block scanning', e)
    }

    return []
  }

  async _getTransferFromMiddleware (account: string, skip: number, offset: number): Array<TxModel> {
    const url = `tx/${account}/history?skip=${skip}&limit=${offset}`
    try {
      const result = await this._api.get(url)
      if (typeof result !== 'object' || !result.data) {
        throw new Error('invalid result')
      }
      if (result.status !== 200) {
        throw new Error(`result not OK: ${result.data.message}`)
      }
      return result.data
    } catch (e) {
      // eslint-disable-next-line
      console.warn('EthereumMiddlewareNode getTransfer Middleware', e)
    }
    return []
  }
}
