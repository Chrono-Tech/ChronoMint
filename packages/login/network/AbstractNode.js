/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
// import SockJS from 'sockjs-client'
import { WebSocketService } from '@chronobank/core/services/WebSocketService'
import Stomp from 'webstomp-client'

const TIMEOUT_BASE = 1000

export default class AbstractNode extends EventEmitter {
  constructor ({ twoFA, api, socket, trace }) {
    super()
    this._twoFA = twoFA
    this._api = api
    this._trace = trace
    this._socket = socket
    this._subscriptions = {}
    this._ws = null
    this._client = null
    this._timeout = TIMEOUT_BASE
    this._missedActions = []
  }

  trace () {
    if (!this._trace) {
      return
    }
    // eslint-disable-next-line
  }

  _handleConnectionSuccess = () => {
    WebSocketService.setConnected(this._socket.user + this._socket.password)
    this._timeout = TIMEOUT_BASE
    const actions = this._missedActions
    for (const action of actions) {
      action()
    }
    this._missedActions = []
  }

  _handleConnectionTimeout = () => {
    this._timeout *= 2
    WebSocketService.setConnected(this._socket.user + this._socket.password, false)
    this.connect()
  }

  _handleConnectionError = (e) => {
    this.trace('Failed to connect to %s server. Retry after %s seconds', this._socket.baseURL, this._timeout / 1000, e)
    setTimeout(this._handleConnectionTimeout, this._timeout)
  }

  _closeSubscription (channel) {
    const subscription = this._subscriptions[channel]
    if (subscription) {
      delete this._subscriptions[channel]
      subscription.unsubscribe()
    }
  }

  _openSubscription (channel, handler) {
    this._subscriptions[channel] = this._client.subscribe(
      channel,
      (message) => {
        try {
          const data = JSON.parse(message.body)
          handler(data)
        } catch (e) {
          this.trace('Failed to decode message', e)
        }
      },
    )
  }

  connect () {
    if (!this._socket) {
      return
    }
    // this._ws = new SockJS(this._socket.baseURL)
    const ws = WebSocketService.connect(this._socket.user + this._socket.password)
    if (ws) {
      this._ws = ws
      this._client = Stomp.over(this._ws, {
        heartbeat: false,
        debug: false,
      })

      if (!WebSocketService.sockets[this._socket.user + this._socket.password].connectedToMiddleware) {
        this._client.connect(
          this._socket.user,
          this._socket.password,
          this._handleConnectionSuccess,
          this._handleConnectionError,
        )
      }
    }
  }

  disconnect () {
    if (this._socket) {
      this._ws.close()
    }
  }

  executeOrSchedule (action) {
    if (this._socket) {
      action()
    } else {
      this._missedActions.push(action)
    }
  }

  /**
   * @abstract
   * @param txid
   */
  // eslint-disable-next-line
  getTransactionInfo (txid) {
    throw new Error('Not implemented')
  }

  /**
   * @abstract
   * @param address
   */
  // eslint-disable-next-line
  getAddressInfo (address) {
    throw new Error('Not implemented')
  }

  /**
   * @abstract
   * @param rawtx
   */
  // eslint-disable-next-line
  send (rawtx) {
    throw new Error('Not implemented')
  }
}
