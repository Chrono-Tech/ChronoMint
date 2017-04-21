import ipfsAPI from 'ipfs-api'

class IPFSDAO {
  init () {
    return new Promise((resolve) => {
      const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
      resolve(ipfs)
      this.node = ipfs
    })
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
          console.log(hash)
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
      if (hash === 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh52' ||
        hash === 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51') {
        resolve(null)
      } else {
        this.getNode().object.get(hash, (err, response) => {
          if (err) {
            throw new Error(err)
          } else {
            const result = response.toJSON()
            const data = JSON.parse(Buffer.from(result.data).toString())
            resolve(data)
          }
        })
      }
    })
  }

  getNode () {
    if (!this.node) {
      throw new Error('Node is undefined. Please use init() to initialize it.')
    }
    return this.node
  }
}

export default new IPFSDAO()
