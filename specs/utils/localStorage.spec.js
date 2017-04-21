import ls from '../../src/utils/localStorage'

describe('localStorage wrapper', () => {
  it('should localStorage exists', () => {
    expect(ls).toBeTruthy()
  })

  it('should handle clear', () => {
    expect(ls.clear()).toEqual(true)
  })

  it('should handle set/get', () => {
    ls('myKey', 'myValue')
    expect(ls('myKey')).toEqual('myValue')
  })

  it('should handle remove', () => {
    ls('myKey', 'myValue')
    expect(ls.remove('myKey')).toEqual(true)
  })

  it('should get length', () => {
    ls.clear()
    ls('myKey', 'myValue')
    expect(ls.getLength()).toEqual(1)
  })
})
