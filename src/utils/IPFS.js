import ipfsAPI from 'ipfs-api'

class IPFS {
  getAPI () {
    if (!this._api) {
      this._api = ipfsAPI({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})
    }
    return this._api
  }

  /**
   * @param value Object that you want to put
   * @returns {Promise.<String>} hash of added value
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
      return 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG' // TODO
      // console.warn('Something wrong with infura, check http://status.infura.io/')
      // throw e
    })
  }

  /**
   * @param hash
   * @returns {Promise.<any|null>}
   */
  get (hash) {
    return new Promise(async (resolve) => {
      if (!hash) {
        return resolve(null)
      }
      this.getAPI().object.get(hash, (err, response) => {
        if (err) {
          throw new Error(err)
        } else {
          const result = response.toJSON()
          const data = JSON.parse(Buffer.from(result.data).toString())
          resolve(data)
        }
      })
    }).catch(e => {
      console.error(e)
      return null
    })
  }
}

export default new IPFS()
