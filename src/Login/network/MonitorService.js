import EventEmitter from 'events'

export const NETWORK_STATUS_ONLINE = 'ONLINE'
export const NETWORK_STATUS_OFFLINE = 'OFFLINE'
export const NETWORK_STATUS_UNKNOWN = 'UNKNOWN'

export const SYNC_STATUS_SYNCING = 'SYNCING'
export const SYNC_STATUS_SYNCED = 'SYNCED'

export default class MonitorService extends EventEmitter {
  // Monitor service should be instantiated in web3Provider
  constructor (web3Provider) {
    super()
    this.reset()

    // Write barrier for async tasks from setInterval that may be cancelled
    this._instance = 0
    this._web3Provider = web3Provider

    // web3Provider is a singleton and monitorService is a singleton.
    // Just check if web3Provider have web3 properly initialized in the callback
    // or do stop/start manually in web3Provider singleton if necessary (but it
    // is needed since a status monitor should monitor network state on all pages)
    this._interval = setInterval(() => {
      this.syncing()
    }, 3000)
  }

  reset () {
    this._web3 = null
    this._instance++
    this._syncStatus = {
      status: SYNC_STATUS_SYNCING,
      progress: 0,
    }
    this._networkStatus = {
      status: NETWORK_STATUS_UNKNOWN,
      connected: false,
    }
  }

  async checkConnected (instance) {
    if (!this._connectedCalback && this._web3) {
      this._connectedCalback = true
      let connected = false
      try {
        connected = await this._web3Provider.isConnected()
      } finally {
        this._connectedCalback = false
        if (instance === this._instance) {
          this._setNetworkStatus(
            connected ? NETWORK_STATUS_ONLINE : NETWORK_STATUS_OFFLINE,
            connected
          )
        }
      }
    }
  }

  async checkSyncing (instance) {
    if (!this._syncingCallback && this._web3) {
      this._syncingCallback = true
      this._web3.eth.getSyncing((error, sync) => {
        this._syncingCallback = false
        if (instance === this._instance) {
          if (error) {
            this._setSyncStatus(SYNC_STATUS_SYNCING, 0)
            return
          }
          // stop all app activity
          if (sync === true) {
            this._setSyncStatus(SYNC_STATUS_SYNCING, 0)
          } else if (sync) {
            this._setSyncStatus(SYNC_STATUS_SYNCING, (sync.currentBlock - sync.startingBlock) / (sync.highestBlock - sync.startingBlock))
          } else {
            this._setSyncStatus(SYNC_STATUS_SYNCED, 1)
          }
        }
      })
    }
  }

  // should not be async
  syncing () {
    // but nested calls are async and have write barriers, it is ok
    this.checkConnected(this._instance)
    this.checkSyncing(this._instance)
  }

  // call after provider changed in web3Provider
  async sync () {
    this.reset()
    this._web3 = await this._web3Provider.getWeb3()
    this.emit('sync', this._syncStatus.status, this._syncStatus.progress)
    this.emit('network', this._networkStatus.status)
  }

  _setSyncStatus (status, progress) {
    if (this._syncStatus.status !== status || this._syncStatus.progress !== progress) {
      this._syncStatus = {
        status,
        progress,
      }
      this.emit('sync', status, progress)
    }
  }

  _setNetworkStatus (status, connected) {
    if (this._networkStatus.status !== status || this._networkStatus.connected !== connected) {
      this._networkStatus = {
        status,
        connected,
      }
      this.emit('network', status)
    }
  }

  getSyncStatus () {
    return this._syncStatus
  }

  getNetworkStatus () {
    return this._networkStatus
  }
}
