import OrbitDB from 'orbit-db'

/**
 * OrbitDB data access object
 * @link https://github.com/haadcode/orbit-db
 */
class OrbitDAO {
  init (ipfsNode) {
    this.orbit = ipfsNode ? new OrbitDB(ipfsNode) : null
    this.mockStore = {}
  }

  /**
   * You should not use this private method or this.orbit directly as well.
   * To interact with Orbit DB use put() and get() methods below.
   * @return {OrbitDB}
   * @private
   */
  _db () {
    if (!this.orbit) {
      throw new Error('Orbit is undefined. Please use init() to initialize it.')
    }
    return this.orbit
  }

  /**
   * @return {Promise.<EventStore>} database log
   * @private
   */
  _log () {
    return new Promise(resolve => {
      const log = this._db().eventlog('ChronoMint.data')
      log.events.on('ready', () => resolve(log))
    })
  }

  /**
   * @param value that you want to put
   * @return {Promise.<String>} hash of added value
   */
  put (value) {
    if (!this.orbit) {
      return this._mockPut(value)
    }
    return this._log().then(log => {
      return log.add(value)
    })
  }

  /**
   * @param hash
   * @return {Promise.<any|null>}
   */
  get (hash: string) {
    if (!this.orbit) {
      return this._mockGet(hash)
    }
    return this._log().then(log => {
      const value = log.get(hash)
      return value ? (value.hash === hash ? value.payload.value : null) : null
    })
  }

  /**
   * @param value
   * @return {Promise.<String>} simulated hash of added value
   * @private
   */
  _mockPut (value) {
    let newHash = 'QmT'
    const possible = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    for (let i = 0; i < 43; i++) {
      newHash += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    this.mockStore[newHash] = value
    return new Promise(resolve => resolve(newHash))
  }

  /**
   * @param hash
   * @return {Promise.<any|null>}
   * @private
   */
  _mockGet (hash: string) {
    return new Promise(resolve => {
      resolve(this.mockStore.hasOwnProperty(hash) ? this.mockStore[hash] : null)
    })
  }
}

export default new OrbitDAO()
