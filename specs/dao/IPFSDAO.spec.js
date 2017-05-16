import ipfsAPI from 'ipfs-api'
import IPFSDAO from '../../src/dao/IPFSDAO'

describe('IPFS DAO', () => {
  const value = { name: `id${Math.random()}` }

  it('should initialize IPFS', () => {
    const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
    expect(JSON.stringify(IPFSDAO.getNode())).toEqual(JSON.stringify(ipfs))
  })

  it('should put and get value', () => {
    return IPFSDAO.put(value).then(hash => {
      IPFSDAO.get(hash).then(result => {
        expect(result).toEqual(value)
      })
    })
  })
})
