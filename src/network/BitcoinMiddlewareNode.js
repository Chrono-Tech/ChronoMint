import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

import BitcoinAbstractNode from './BitcoinAbstractNode'


export default class BitcoinMiddlewareNode extends BitcoinAbstractNode {
  constructor ({ api, socket, trace }) {
    super()
    this._api = api
    this._trace = trace
    this._socket = socket
    this._subscriptions = {}
    this._missedActions = []

    this._handleSubscibe = this.addListener('subscribe', async address => {
      if (this._socket) {
        try {
          await this._api.post('addr', {
            address,
          })
          this.executeOrSschedule(() => {
            this._subscriptions[`balance:${address}`] = this._client.subscribe(
              `${socket.channels.balance}.${address}`,
              message => {
                this.trace('Address Balance', message.body)
              }
            )
          })
        } catch (e) {
          this.trace('Address subscription error', e)
        }
      }
    })

    this._handleUnsubscribe = this.addListener('unsubscribe', async address => {
      if (this._socket) {
        try {
          await this._api.delete('addr', {
            address,
          })
          this.executeOrSschedule(() => {
            const subscription = this._subscriptions[`balance:${address}`]
            if (subscription) {
              delete this._subscriptions[`balance:${address}`]
              subscription.unsubscribe()
            }
          })
        } catch (e) {
          this.trace('Address subscription error', e)
        }
      }
    })

    this.connect()
  }

  connect () {
    if (this._socket) {
      let ws = new SockJS(this._socket.baseURL)
      this._client = Stomp.over(ws, { heartbeat: false, debug: true })
      this.trace('Socket connect credentials', this._socket.user, this._socket.password)
      this._client.connect(this._socket.user, this._socket.password,
        () => {
          this.trace('Handle missed')
          this.handleMissed()
        },
        e => {
          this.trace('Failed to connect. Retry after 5 seconds', e)
          setTimeout(() => {
            this.connect()
          }, 5000)
        }
      )
    }
  }

  executeOrSschedule (action) {
    if (this._socket) {
      action()
    } else {
      this._missedActions.push(action)
    }
  }

  handleMissed () {
    const actions = this._missedActions
    for (const action of actions) {
      action()
    }
    this._missedActions = []
  }

  async getTransactionInfo (txid) {
    try {
      const res = await this._api.get(`/tx/${txid}`)
      return res.data
    } catch (e) {
      this.trace(`getTransactionInfo ${txid} failed`, e)
      throw e
    }
  }

  async getAddressInfo (address) {
    try {
      // console.log('Call', this)
      if (this._socket) {
        // eslint-disable-next-line
        console.log('balance', await this._api.get(`/addr/${address}/balance`))
        // eslint-disable-next-line
        console.log('utxo', await this._api.get(`/addr/${address}/utxo`))
      }

      const res = await this._api.get(`/addr/${address}/balance`)
      const {
        confirmations0,
        confirmations3,
        confirmations6,
      } = res.data
      return {
        balance0: confirmations0.amount,
        balance3: confirmations3.amount,
        balance6: confirmations6.amount,
      }
    } catch (e) {
      this.trace(`getAddressInfo ${address} failed`, e)
      throw e
    }
  }

  async getAddressUTXOS (address) {
    try {
      const res = await this._api.get(`/addr/${address}/utxo`)
      return res.data
    } catch (e) {
      this.trace(`getAddressInfo ${address} failed`, e)
      throw e
    }
  }

  async send (rawtx) {
    try {
      const params = new URLSearchParams()
      params.append('rawtx', rawtx)
      const res = await this._api.post('/tx/send', params)
      // TODO @ipavlenko: Temporary emulate event from the socket
      setTimeout(() => {
        this.emit('tx', res.data)
      }, 0)

      return res.data
    } catch (e) {
      this.trace(`send transaction ${rawtx} failed`, e)
      throw e
    }
  }
}
