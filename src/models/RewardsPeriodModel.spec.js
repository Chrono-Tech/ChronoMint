import BigNumber from 'bignumber.js'
import moment from 'moment'
import RewardsPeriodModel from './RewardsPeriodModel'

const model = new RewardsPeriodModel({
  id: 0,
  totalDeposit: new BigNumber(300),
  userDeposit: new BigNumber(30),
  isClosed: false,
  startDate: Math.floor(Date.now() / 1000) - 86400,
  assetBalance: new BigNumber(1000000000),
  uniqueShareholders: 3,
  periodLength: 10,
})

describe('rewards contract model', () => {
  it('should get id', () => {
    expect(model.index()).toEqual(1)
  })

  it('should get total deposit', () => {
    expect(model.totalDeposit()).toEqual(new BigNumber(300))
  })

  it('should get total deposit percent', () => {
    expect(model.totalDepositPercent(new BigNumber(600))).toEqual('50')
  })

  it('should get user deposit', () => {
    expect(model.userDeposit()).toEqual(new BigNumber(30))
  })

  it('should get user revenue', () => {
    expect(model.userRevenue(model.assetBalance())).toEqual(new BigNumber(100000000))
  })

  it('should get user deposit percent', () => {
    expect(model.userDepositPercent()).toEqual('10')
  })

  it('should get unique shareholders', () => {
    expect(model.uniqueShareholders()).toEqual(3)
  })

  it('should get start moment', () => {
    expect(model.startMoment()).toEqual(moment.unix(model.get('startDate')))
  })

  it('should get start date', () => {
    expect(model.startDate()).toEqual(model.startMoment())
  })

  it('should get end moment', () => {
    expect(model.endMoment()).toEqual(model.startMoment().add(model.periodLength(), 'days'))
  })

  it('should get end date', () => {
    expect(model.endDate()).toEqual(model.endMoment())
  })

  it('should get days remaining', () => {
    expect(model.daysRemaining()).toEqual(8)
  })

  it('should get days passed', () => {
    expect(model.daysPassed()).toEqual(1)
  })

  it('should get isClosable', () => {
    expect(model.isClosable()).toBeFalsy()
  })
})
