/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import { modalsOpen } from 'redux/modals/actions'

export const USER_ACTIVE = 'USER_ACTIVE'

export class UserMonitorService extends EventEmitter {
  constructor () {
    super()

    this._idleInterval = 3 * 60 * 1000 // idle interval, in milliseconds
    this._checkTime = Date.now() // date last check
    this._throttlingInterval = 5 * 1000
    this._active = 'active'
  }

  _status () {
    return {
      active: this._active,
    }
  }

  _listener = () => this._sendActiveSignal()

  start () {
    // remove old Listeners
    this._removeListeners()

    // prod only
    if (process.env.NODE_ENV === 'development') {
      return
    }

    document.addEventListener('mousemove', this._listener)
    document.addEventListener('keypress', this._listener)
    this._timer = setTimeout(this._sendIdleSignal, this._idleInterval)
  }

  _removeListeners () {
    document.removeEventListener('mousemove', this._listener)
    document.removeEventListener('keypress', this._listener)
  }

  stop () {
    this._removeListeners()
    clearTimeout(this._timer)
  }

  _sendIdleSignal = () => {
    this._active = false
    clearTimeout(this._timer)

    this.emit('active', this._status())
  }

  _sendActiveSignal = () => {
    const now = Date.now()
    if (now - this._checkTime > this._throttlingInterval) {
      this._checkTime = now
      this._active = true

      // for tests
      // this.emit('active', this._status)

      // clear idle timeout
      clearTimeout(this._timer)
      this._timer = setTimeout(this._sendIdleSignal, this._idleInterval)
    }
  }

  setOnActive = (dispatch) => {
    this.on('active', () => dispatch(modalsOpen({ componentName: 'UserActiveDialog' })))
  }
}

export default new UserMonitorService()
