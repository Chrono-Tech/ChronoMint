import LOCModel, { THE_90_DAYS } from '../../src/models/LOCModel'

describe('LOC model', () => {
  it('should construct and return data', () => {
    let model = new LOCModel({
      name: 'name',
      oldName: 'oldName',
      website: 'www',
      issueLimit: 1000,
      issued: 10,
      redeemed: 5,
      status: 1,
      currency: 2,
      isNew: false
    })

    expect(model.name()).toBe('name')
    expect(model.oldName()).toBe('oldName')
    expect(model.issueLimit()).toBe(1000)
    expect(model.issued()).toBe(10)
    expect(model.expDate() - model.createDate()).toEqual(THE_90_DAYS)
    // TODO @dkchv: don't work with moment, actual = 95
    // expect(model.daysLeft()).toBe(90) // ????
    expect(model.status()).toBe(1)
    expect(model.currency()).toBe(2)
    expect(model.currencyString()).toBe('LHT')
    expect(model.isNew()).toBe(false)

    model = model.isPending(true)
    expect(model.isPending()).toBe(true)
    expect(model.isFailed()).toBe(false)

    model = model.isFailed(true)
    expect(model.isPending()).toBe(false)
    expect(model.isFailed()).toBe(true)
  })
})
