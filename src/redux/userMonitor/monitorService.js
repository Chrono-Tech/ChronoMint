import EventEmitter from 'events'

export const USER_ACTIVE = 'USER_ACTIVE'

export class UserMonitorService extends EventEmitter {
  constructor () {
    super()

    this.idleInterval = 10000 // idle interval, in milliseconds
    this.checkTime = Date.now() // date last check
    this.throttlingInterval = 5000
    this.active = 'active'
    this.idleAction = null
    this.activeAction = null
  }

  get status () {
    const {active} = this
    return {
      type: USER_ACTIVE,
      payload: {
        active
      }
    }
  }

  start () {
    document.onmousemove = () => {
      this.sendActiveSignal()
    }
    document.onkeypress = () => {
      this.sendActiveSignal()
    }
    this.timer = setTimeout(this.sendIdleSignal, this.idleInterval)
  }

  stop () {
    document.onmousemove = null
    document.onkeypress = null
    clearTimeout(this.timer)
  }

  sendIdleSignal = () => {
    this.active = false
    clearTimeout(this.timer)

    this.emit('active', this.status)
  }

  sendActiveSignal = () => {
    if (Date.now() - this.checkTime > this.throttlingInterval) {
      this.checkTime = Date.now()
      this.active = true

      // for tests
      // this.emit('active', this.status)
      // clear idle timeout
      clearTimeout(this.timer)
      this.timer = setTimeout(this.sendIdleSignal, this.idleInterval)
    }
  }

}

export default new UserMonitorService()
