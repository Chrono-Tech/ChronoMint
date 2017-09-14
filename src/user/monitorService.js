import EventEmitter from 'events'

export const USER_ACTIVE = 'USER_ACTIVE'

export class UserMonitorService extends EventEmitter {
  constructor () {
    super()

    this.idleInterval = 3 * 60 * 1000 // idle interval, in milliseconds
    this.checkTime = Date.now() // date last check
    this.throttlingInterval = 5 * 1000
    this.active = 'active'
  }

  get status () {
    const {active} = this
    return {
      active
    }
  }

  listener = () => this.sendActiveSignal()

  start () {
    // remove old Listeners
    this.removeListeners()

    document.addEventListener('mousemove', this.listener)
    document.addEventListener('keypress', this.listener)

    this.timer = setTimeout(this.sendIdleSignal, this.idleInterval)
  }

  removeListeners () {
    document.removeEventListener('mousemove', this.listener)
    document.removeEventListener('keypress', this.listener)
  }

  stop () {
    this.removeListeners()
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
