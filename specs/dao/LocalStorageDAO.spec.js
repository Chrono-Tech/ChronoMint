import LS from '../../src/dao/LocalStorageDAO'

describe('LocalStorageDAO', () => {
  it('should set & get account, show valid length and then clear storage', () => {
    LS.setAccount('abc')
    expect(LS.getAccount()).toEqual('abc')
    expect(LS.length()).toEqual(1)

    LS.clear()
    expect(LS.length()).toEqual(0)
  })

  it('should set and get another values', () => {
    LS.setLocale('en')
    expect(LS.getLocale()).toEqual('en')

    LS.setLastUrls({abc: 'xyz'})
    expect(LS.getLastUrls()).toEqual({abc: 'xyz'})

    LS.setNotices(['a', 'b'])
    expect(LS.getNotices()).toEqual(['a', 'b'])

    LS.setWeb3Provider('xyz')
    expect(LS.getWeb3Provider()).toEqual('xyz')

    LS.setNetworkId('why')
    expect(LS.getNetworkId()).toEqual('why')

    LS.setWatchFromBlock('test', 100)
    expect(LS.getWatchFromBlock('test')).toEqual(100)
  })
})
