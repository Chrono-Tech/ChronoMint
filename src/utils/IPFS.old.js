import ipfsAPI from 'ipfs-api'
import promisify from 'promisify-node-callback'

class IPFS {

  getAPI () {
    if (!this._api) {
      this._api = ipfsAPI({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})
    }
    return this._api
  }

  /**
   * @param value Object that you want to put
   * @returns {Promise<String>} hash of added value
   */
  put (value) {
    return new Promise((resolve, reject) => {
      const putValue = value ? {
        Data: Buffer.from(JSON.stringify(value)),
        Links: []
      } : ''
      this.getAPI().object.put(putValue, (err, response) => {
        if (err) {
          return reject(err)
        }
        const hash = response.toJSON().multihash
        resolve(hash)
      })
    }).catch(e => {
      // eslint-disable-next-line
      console.warn('Something wrong with infura, check http://status.infura.io/')
      throw e
    })
  }

  /**
   * @param hash
   * @returns {Promise<any|null>}
   */
  async get (hash) {
    if (!hash) {
      return null
    }

    return new Promise(async (resolve) => {
      try {
        // TODO @bshevchenko: this is temporarily, to limit time of data downloading
        setTimeout(() => {
          resolve(null)
        }, 3000)

        const response = await promisify(this.getAPI().object.get)(hash)
        const result = response.toJSON()

        resolve(JSON.parse(Buffer.from(result.data).toString()))

      } catch (e) {
        // eslint-disable-next-line
        console.warn('IPFS get error', e, 'hash', hash)
        resolve(null)
      }
    })
  }
}

export default new IPFS()
