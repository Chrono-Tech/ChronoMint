/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const WAIT_FOR_METAMASK = 2000 // ms

import EventEmitter from 'events'

class metaMaskResolver extends EventEmitter {
  _resolver () {
    let timer
    let metaMaskInstance

    timer = setTimeout(() => {
      timer = null
      this.emit('resolve', false)
    }, WAIT_FOR_METAMASK)

    if (window.web3 !== undefined || window.hasOwnProperty('web3')) {
      clearTimeout(timer)
      return this.emit('resolve', true)
    }

    // wait for metamask
    Object.defineProperty(window, 'web3', {
      set: (web3) => {
        timer && clearTimeout(timer)
        metaMaskInstance = web3
	console.log('metaMaskInstance is: ')
        console.log(web3)
        this.emit('resolve', true)
      },
      get: () => {
        return metaMaskInstance
      },
    })
  }

  start () {
    this._resolver()
  }
}

export default new metaMaskResolver()
