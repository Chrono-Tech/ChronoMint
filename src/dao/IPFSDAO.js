import ipfsAPI from 'ipfs-api'

class IPFSDAO {
  init () {
    return new Promise((resolve, reject) => {
      const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
      resolve(ipfs)
      this.node = ipfs
    })
  }

  getNode () {
    if (!this.node) {
      throw new Error('Node is undefined. Please use init() to initialize it.')
    }
    return this.node
  }

  goOffline () {
    return new Promise(resolve => {
      this.getNode().goOffline(() => {
        resolve(true)
      })
    })
  }
}

export default new IPFSDAO()
