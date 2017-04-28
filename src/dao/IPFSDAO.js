import ipfsAPI from 'ipfs-api'

class IPFSDAO {
  getNode () {
    if (!this.node) {
      this.node = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
    }
    return this.node
  }
  /**
   * @param value Object that you want to put
   * @return {Promise.<String>} hash of added value
   */
  put (value) {
    return new Promise((resolve) => {
      this.getNode().object.put(value ? {
        Data: Buffer.from(JSON.stringify(value)),
        Links: []
      } : '',
      (err, response) => {
        if (err) {
          throw new Error(err)
        } else {
          const hash = response.toJSON().multihash
          resolve(hash)
        }
      })
    })
  }
  /**
   * @param hash
   * @return {Promise.<any|null>}
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

export default new IPFSDAO()
