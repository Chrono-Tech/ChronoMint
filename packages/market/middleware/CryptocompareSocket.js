/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/*
 * INFO: WebSocket API https://www.cryptocompare.com/api/#-api-web-socket-
 * INFO: socket.io-client based on Emitter NPM package
 * Emitter API https://github.com/component/emitter
 */

import io from 'socket.io-client'
import { URL } from './constants'
import { prepareSubscriptions, extractMessage } from './utils'

class CryptocompareSocket {
  constructor () {
    this.socket = null
    this.manager = null
    this.subscriptions = null
    this.actions = {}
    this.WStimeout = null
    this.eventHandlers = {}
    this.isGraceful = false
  }

  subscribe () {
    this.subscriptions = this.subscriptions || prepareSubscriptions()

    return new Promise((resolve, reject) => {
      try {
        this.socket.emit('SubAdd', { subs: this.subscriptions })
        return resolve()
      } catch (error) {
        return reject(error)
      }
    })
  }

  setEventHandler (event, eventHandler) {
    if (event && eventHandler) {
      this.eventHandlers[event] = eventHandler
    }
    return new Promise((resolve, reject) => {
      try {
        if (event === 'disconnect') {
          this.socket.on('disconnect', () => {
            eventHandler(this.isGraceful)
          })
        } else {
          this.socket.on([event], (data) => {
            const extractedData = extractMessage(data)
            eventHandler(extractedData)
          })
        }
        return resolve()
      } catch (error) {
        return reject(error)
      }
    })
  }

  unsetEventHandler (event, eventHandler) {
    return new Promise((resolve, reject) => {
      try {
        this.socket.off([event], eventHandler)
        return resolve()
      } catch (error) {
        return reject(error)
      }
    })
  }

  unsubscribe () {
    return new Promise((resolve, reject) => {
      try {
        this.socket.emit('SubRemove', { subs: this.subscriptions })
        return resolve()
      } catch (error) {
        return reject(error)
      }
    })
  }

  connect () {
    if (this.socket) {
      this.socket.destroy()
      delete this.socket
      this.socket = null
    }
    return new Promise((resolve, reject) => {
      this.socket = io(URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax : 5000,
        reconnectionAttempts: Infinity,
        forceNew: true,
        transports: ['websocket'],
        timeout: 10000,
      })
      this.socket.on('connect', () => {
        this.isGraceful = false
        return resolve()
      })
      this.socket.on('disconnect', () => {
        return reject()
      })
      this.socket.on('ping', () => {
        this.WStimeout = setTimeout(() => {  // if it doesn't respond within two seconds
          if (this.socket && this.socket.io.readyState === 'open') {  // and if the connection is still open
            this.socket.close() // force reconnect
          }
        }, 2000)
      })
      this.socket.on('pong', () => {
        clearTimeout(this.WStimeout)
      })
      // this.socket.on('connect_timeout', (timeout) => {
      //   console.log('MARKET connect_timeout', timeout)
      // })
      Object.keys(this.eventHandlers).forEach((eventKey) => {
        this.setEventHandler(eventKey, this.eventHandlers[eventKey])
      })
      this.socket.connect()
    })
  }

  disconnect (isGraceful) {
    this.isGraceful = isGraceful
    return new Promise((resolve, reject) => {
      this.unsubscribe()
      try {
        this.socket.close()
        this.socket = null
        return resolve()
      } catch (error) {
        return reject(error)
      }
    })
  }
}

export default new CryptocompareSocket()
