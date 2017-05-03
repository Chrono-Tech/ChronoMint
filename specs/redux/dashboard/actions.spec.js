import * as actions from '../../../src/redux/dashboard/actions'
import {
  DASHBOARD_TOTAL_LHT_FETCH,
  DASHBOARD_TOTAL_LHT,
  DASHBOARD_TOTAL_MEMBERS,
  DASHBOARD_TOTAL_MEMBERS_FETCH
} from '../../../src/redux/dashboard/reducer'
import { store } from '../../init'

describe('dashboard actions', () => {
  it('should fetch total LHT balance', () => {
    return store.dispatch(actions.updateTotalLHT()).then(() => {
      expect(store.getActions()[0].type).toEqual(DASHBOARD_TOTAL_LHT_FETCH)
      expect(store.getActions()[1].type).toEqual(DASHBOARD_TOTAL_LHT)
      const balance = store.getActions()[1].payload
      expect(balance).toBeGreaterThanOrEqual(0)
    })
  })

  it('should fetch total members', () => {
    return store.dispatch(actions.updateTotalMembers()).then(() => {
      expect(store.getActions()[0].type).toEqual(DASHBOARD_TOTAL_MEMBERS_FETCH)
      expect(store.getActions()[1].type).toEqual(DASHBOARD_TOTAL_MEMBERS)
      const number = store.getActions()[1].payload
      expect(number).toBeGreaterThan(0)
    })
  })
})
