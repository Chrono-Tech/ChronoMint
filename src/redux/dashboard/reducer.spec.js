import reducer from './reducer'
import * as actions from './actions'

describe('dashboard reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {}))
      .toEqual({
        totalLHT: {
          balance: null,
          isFetching: true
        },
        totalMembers: {
          number: null,
          isFetching: true
        }
      })
  })

  it('should handle DASHBOARD_TOTAL_LHT_FETCH', () => {
    expect(reducer({}, {type: actions.DASHBOARD_TOTAL_LHT_FETCH}))
      .toEqual({
        totalLHT: {
          isFetching: true
        }
      })
  })

  it('should handle DASHBOARD_TOTAL_LHT', () => {
    expect(reducer({}, {type: actions.DASHBOARD_TOTAL_LHT, payload: 5}))
      .toEqual({
        totalLHT: {
          isFetching: false,
          balance: 5
        }
      })
  })

  it('should handle DASHBOARD_TOTAL_MEMBERS_FETCH', () => {
    expect(reducer({}, {type: actions.DASHBOARD_TOTAL_MEMBERS_FETCH}))
      .toEqual({
        totalMembers: {
          isFetching: true
        }
      })
  })

  it('should handle DASHBOARD_TOTAL_MEMBERS', () => {
    expect(reducer({}, {type: actions.DASHBOARD_TOTAL_MEMBERS, payload: 5}))
      .toEqual({
        totalMembers: {
          isFetching: false,
          number: 5
        }
      })
  })
})
