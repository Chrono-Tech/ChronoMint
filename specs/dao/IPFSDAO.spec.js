import ipfsAPI from 'ipfs-api'
import IPFSDAO from '../../src/dao/IPFSDAO'

describe('IPFS DAO', () => {
  it('should initialize IPFS', () => {
    const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
    return IPFSDAO.init().then(node => {
      expect(JSON.stringify(IPFSDAO.getNode())).toEqual(JSON.stringify(ipfs))
    })
  })

  it('should call put and get methods', () => {
    expect(typeof IPFSDAO.put('value').then).toEqual('function')
    expect(typeof IPFSDAO.get('hash').then).toEqual('function')
  })

  it('should put and get value', () => {
    const value = {name: `id${Math.random()}`}
    return IPFSDAO.put(value).then(hash => {
      return IPFSDAO.get(hash).then(result => {
        expect(result).toEqual(value)
      })
    })
  })
})
