import ipfsAPI from 'ipfs-api'
import IPFSDAO from '../../src/dao/IPFSDAO'

describe('IPFS DAO', () => {
  it('should initialize IPFS', () => {
    const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
    return IPFSDAO.init().then(node => {
      expect(JSON.stringify(IPFSDAO.getNode())).toEqual(JSON.stringify(ipfs))
    })
  })

  afterAll(() => {
    return IPFSDAO.goOffline()
  })
})
