import web3Provider from 'network/Web3Provider'
import EventEmitter from 'events'

export const NETWORK_STATUS_ONLINE = 'ONLINE'
export const NETWORK_STATUS_OFFLINE = 'OFFLINE'

export const SYNC_STATUS_SYNCING = 'SYNCING'
export const SYNC_STATUS_SYNCED = 'SYNCED'

export class MonitorService extends EventEmitter {
  constructor () {
    super()
    this._syncStatus = {
      status: SYNC_STATUS_SYNCING,
      progress: 0
    }
    this._networkStatus = {
      status: NETWORK_STATUS_OFFLINE,
      connected: false
    }
    this.init()
  }

  async init () {

    const web3 = await web3Provider.getWeb3()

    this._interval = setInterval(() => {
      const connected = web3.isConnected()
      this._setNetworkStatus(
        connected ? NETWORK_STATUS_ONLINE : NETWORK_STATUS_OFFLINE,
        connected
      )

      if (!this._syncingCallback) {
        this._syncingCallback = true
        web3.eth.getSyncing((error, sync) => {
          this._syncingCallback = false
          if (error) {
            this._setSyncStatus(SYNC_STATUS_SYNCING, 0)
            return
          }
          // stop all app activity
          if(sync === true) {
            this._setSyncStatus(SYNC_STATUS_SYNCING, 0)
          } else if (sync) {
            this._setSyncStatus(SYNC_STATUS_SYNCING, (sync.currentBlock - sync.startingBlock) / (sync.highestBlock - sync.startingBlock))
          } else {
            this._setSyncStatus(SYNC_STATUS_SYNCED, 1)
          }
        })
      }
    }, 3000)
  }

  flush () {
    this.emit('sync', this._syncStatus.status, this._syncStatus.progress)
    this.emit('network', this._networkStatus.status)
  }

  _setSyncStatus (status, progress) {
    if (this._syncStatus.status !== status || this._syncStatus.progress !== progress) {
      this._syncStatus = {
        status,
        progress
      }
      this.emit('sync', status, progress)
    }
  }

  _setNetworkStatus (status, connected) {
    if (this._networkStatus.status !== status || this._networkStatus.connected !== connected) {
      this._networkStatus = {
        status,
        connected
      }
      this.emit('network', status)
    }
  }

  getSyncStatus () {
    this._syncStatus
  }

  getNetworkStatus () {
    this._networkStatus
  }
}

export default new MonitorService()
