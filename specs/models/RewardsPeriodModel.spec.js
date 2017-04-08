import RewardsPeriodModel from '../../src/models/RewardsPeriodModel'
import moment from 'moment'

const model = new RewardsPeriodModel({
  id: 0,
  totalDeposit: 300,
  currentUserDeposit: 30,
  isClosed: false,
  startDate: Math.floor(Date.now() / 1000) - 86400,
  assetBalance: 1000,
  uniqueShareholders: 3,
  periodLength: 10
})

describe('rewards contract model', () => {
  it('should get id', () => {
    expect(model.getId()).toEqual(1)
  })

  it('should get total deposit', () => {
    expect(model.getTotalDeposit()).toEqual(300)
  })

  it('should get total deposit percent', () => {
    expect(model.getTotalDepositPercent(600)).toEqual(50)
  })

  it('should get user deposit', () => {
    expect(model.getUserDeposit()).toEqual(30)
  })

  it('should get user revenue', () => {
    expect(model.getUserRevenue(model.getAssetBalance())).toEqual(1)
  })

  it('should get user deposit percent', () => {
    expect(model.getUserDepositPercent()).toEqual(10)
  })

  it('should get asset balance in LH', () => {
    expect(model.getAssetBalance()).toEqual(10)
  })

  it('should get unique shareholders', () => {
    expect(model.getUniqueShareholders()).toEqual(3)
  })

  it('should get start moment', () => {
    expect(model.getStartMoment()).toEqual(moment.unix(model.startDate))
  })

  it('should get start date', () => {
    expect(model.getStartDate()).toEqual(model.getStartMoment().format('Do MMMM YYYY'))
  })

  it('should get end moment', () => {
    expect(model.getEndMoment()).toEqual(model.getStartMoment().add(model.periodLength, 'days'))
  })

  it('should get end date', () => {
    expect(model.getEndDate()).toEqual(model.getEndMoment().format('Do MMMM YYYY'))
  })

  it('should get days remaining', () => {
    expect(model.getDaysRemaining()).toEqual(8)
  })

  it('should get days passed', () => {
    expect(model.getDaysPassed()).toEqual(1)
  })

  it('should get isClosable', () => {
    expect(model.isClosable()).toBeFalsy()
  })
})
