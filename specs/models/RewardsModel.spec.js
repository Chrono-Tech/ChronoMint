import RewardsModel from '../../src/models/RewardsModel'

const model = new RewardsModel({
  periodLength: 10,
  lastPeriod: 1,
  accountDeposit: 100,
  accountRewards: 1000,
  currentAccumulated: 2000,
  timeTotalSupply: 300
})

describe('rewards contract model', () => {
  it('should get period length', () => {
    expect(model.getPeriodLength()).toEqual(10)
  })

  it('should get last period index', () => {
    expect(model.lastPeriodIndex()).toEqual(2)
  })

  it('should get account deposit', () => {
    expect(model.getAccountDeposit()).toEqual(100)
  })

  it('should get account rewards in LH', () => {
    expect(model.getAccountRewards()).toEqual(10)
  })

  it('should get account rewards in LH', () => {
    expect(model.getCurrentAccumulated()).toEqual(20)
  })

  it('should get time total supply', () => {
    expect(model.getTimeTotalSupply()).toEqual(300)
  })
})
