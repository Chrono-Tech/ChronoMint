import contractManagerDAO from 'dao/ContractsManagerDAO'
import LOCModel, { THE_90_DAYS } from './LOCModel'

describe('LOC model', () => {
  it('should construct and return data', async () => {
    const locManager = await contractManagerDAO.getLOCManagerDAO()

    let model = new LOCModel({
      name: 'name',
      oldName: 'oldName',
      website: 'www',
      issueLimit: 1000,
      issued: 10,
      redeemed: 5,
      status: 1,
      isNew: false,
      token: locManager.getDefaultToken(),
    })

    expect(model.name()).toBe('name')
    expect(model.oldName()).toBe('oldName')
    expect(model.issueLimit()).toBe(1000)
    expect(model.issued()).toBe(10)
    expect(Math.floor((model.expDate() - model.createDate()) / 1000)).toEqual(Math.floor(THE_90_DAYS / 1000))
    expect(model.daysLeft()).toBe(90 - 1)
    expect(model.status()).toBe(1)
    expect(model.currency()).toBe('LHT')
    expect(model.isNew()).toBe(false)

    model = model.isPending(true)
    expect(model.isPending()).toBe(true)
    expect(model.isFailed()).toBe(false)

    model = model.isFailed(true)
    expect(model.isPending()).toBe(false)
    expect(model.isFailed()).toBe(true)
  })
})
