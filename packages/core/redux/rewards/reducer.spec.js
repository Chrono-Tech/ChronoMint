/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import reducer from './reducer'
import * as a from './actions'
import RewardsModel from '../../models/rewards/RewardsModel'
import { store } from '../../specsInit'

let data: RewardsModel = new RewardsModel({ address: '0x10' })

describe('rewards', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      data: new RewardsModel(),
      isFetching: false,
      isFetched: false,
    })
  })

  it('should handle REWARDS_DATA', () => {
    expect(reducer([], { type: a.REWARDS_DATA, data })).toEqual({
      data,
      isFetching: false,
      isFetched: true,
    })
  })

  // it('should handle REWARDS_FETCH_START', () => {
  //   expect(reducer([], { type: a.REWARDS_FETCH_START, data })).toEqual({
  //     isFetching: true,
  //   })
  // })

  // it.skip('should get rewards data', () => store.dispatch(a.getRewardsData()).then(() => {
  //   data = store.getActions()[1].data
  //   expect(store.getActions()).toEqual([
  //     { type: a.REWARDS_FETCH_START },
  //     { type: a.REWARDS_DATA, data },
  //   ])
  //   expect(data instanceof RewardsModel).toBeTruthy()
  //   expect(data.periods.size).toBeGreaterThanOrEqual(1)
  //   expect(data.periods.get(0) instanceof RewardsPeriodModel).toBeTruthy()
  // }))

  it.skip('should withdraw revenue', () => store.dispatch(a.withdrawRevenue()).then(() => {
    data = store.getActions()[2].data
    expect(store.getActions()).toEqual([
      // { type: a.REWARDS_FETCH_START },
      // { type: a.REWARDS_FETCH_START },
      { type: a.REWARDS_DATA, data },
    ])
  }))

  // it('should close period', () => store.dispatch(a.closePeriod()).then(() => {
  //   expect(store.getActions()).toEqual([
  //     { type: a.REWARDS_FETCH_START },
  //   ])
  // }))
})
