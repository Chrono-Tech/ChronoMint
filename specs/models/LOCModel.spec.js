import LOCModel from '../../src/models/LOCModel'

describe('LOC model', () => {
  it('should construct and return data', () => {
    const model = new LOCModel({address: 0x100, hasConfirmed: true, locName: 'LocX', website: 'www', issueLimit: 1000, issued: 10, redeemed: 5, expDate: 4545454545, status: 1})
    expect(model.getAddress()).toBe(0x100)
    expect(model.name()).toBe('LocX')
    expect(model.issueLimit()).toBe(1000 / 100000000)
    expect(model.issued()).toBe(10 / 100000000)
    expect(model.redeemed()).toBe(5)
    expect(model.expDate()).toBe(4545454545)
    expect(model.status()).toBe(1)
  })
})
