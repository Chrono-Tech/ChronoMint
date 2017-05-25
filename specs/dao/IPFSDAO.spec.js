import ipfsAPI from 'ipfs-api'
import IPFS from '../../src/utils/IPFS'

describe('IPFS DAO', () => {
  const value = { name: `id${Math.random()}` }

  it('should initialize IPFS', () => {
    const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
    expect(JSON.stringify(IPFS.getNode())).toEqual(JSON.stringify(ipfs))
  })

  it('should put and get value', () => {
    return IPFS.put(value).then(hash => {
      IPFS.get(hash).then(result => {
        expect(result).toEqual(value)
      })
    })
  })

  it('should throw Error on get', () => {
    return IPFS.get('hash').then(result => {
      expect(result).toBeNull()
    })
  })

  it('should throw Error on put', (done) => {
    return IPFS.put('').catch(e => {
      done(e)
    })
  })
})
