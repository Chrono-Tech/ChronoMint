import ipfsAPI from 'ipfs-api'

class IPFS {
  getNode () {
    if (!this.node) {
      this.node = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
    }
    return this.node
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
      this.getNode().object.put(putValue, (err, response) => {
        if (err) {
          return reject(err)
        }
        const hash = response.toJSON().multihash
        resolve(hash)
      })
    }).catch(e => {
      console.warn('Something wrong with infura, check http://status.infura.io/')
      throw e
    })
  }

  /**
   * @param hash
   * @returns {Promise.<any|null>}
   */
  get (hash) {
    return new Promise((resolve) => {
      if (!hash) {
        return resolve(null)
      }
      this.getNode().object.get(hash, (err, response) => {
        if (err) {
          resolve(null)
        } else {
          const result = response.toJSON()
          const data = JSON.parse(Buffer.from(result.data).toString())
          resolve(data)
        }
      })
    })
  }
}

export default new IPFS()
