import ipfsAPI from 'ipfs-api'
import IPFSDAO from '../../src/dao/IPFSDAO'

describe('IPFS DAO', () => {
  const value = { name: `id${Math.random()}` }
  const error = new Error('Node is undefined. Please use init() to initialize it.')

  it('should throw Error Please use init()', () => {
    IPFSDAO.node = null
    expect(() => IPFSDAO.getNode()).toThrow(error)
    IPFSDAO.put(value).catch(err => {
      expect(err).toEqual(error)
    })
  })

  it('should initialize IPFS', () => {
    const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
    return IPFSDAO.init().then(node => {
      expect(JSON.stringify(IPFSDAO.getNode())).toEqual(JSON.stringify(ipfs))
    })
  })

  it('should put and get value', () => {
    return IPFSDAO.put(value).then(hash => {
      IPFSDAO.get(hash).then(result => {
        expect(result).toEqual(value)
      })
    })
  })

  it('should throw Error on get', () => {
    expect(IPFSDAO.get('hash')).toThrow()
  })

  it('should throw Error on put', () => {
    expect(IPFSDAO.put('')).toThrow()
  })
})
