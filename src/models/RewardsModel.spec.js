import RewardsModel from './RewardsModel'

const model = new RewardsModel({
  periodLength: 10,
  lastPeriod: 1,
  accountDeposit: 100,
  accountRewards: 10,
  currentAccumulated: 20,
  timeTotalSupply: 300,
})

describe('rewards model', () => {
  it('should get period length', () => {
    expect(model.periodLength()).toEqual(10)
  })

  it('should get last period index', () => {
    expect(model.lastPeriodIndex()).toEqual(2)
  })

  it('should get account deposit', () => {
    expect(model.accountDeposit()).toEqual(100)
  })

  it('should get account rewards in LH', () => {
    expect(model.accountRewards()).toEqual(10)
  })

  it('should get current accumulated rewards in LH', () => {
    expect(model.currentAccumulated()).toEqual(20)
  })

  it('should get time total supply', () => {
    expect(model.timeTotalSupply()).toEqual(300)
  })
})
