import * as a from './actions'
import { accounts } from '../../specsInit'
import ProfileModel from '../../models/ProfileModel'
import reducer from './reducer'

const profile = new ProfileModel({ name: Math.random() })
const initialState = {
  account: null,
  isSession: false,
  profile: new ProfileModel(),
  isCBE: false,
}

describe('settings cbe reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {}))
      .toEqual(initialState)
  })

  it('should handle SESSION_CREATE', () => {
    expect(reducer({ isSession: false }, { type: a.SESSION_CREATE, account: accounts[0] }))
      .toEqual({
        account: accounts[0],
        isSession: true,
      })
  })

  it('should handle DESTROY_SESSION', () => {
    expect(reducer({ some: 123 }, { type: a.SESSION_DESTROY }))
      .toEqual(initialState)
  })

  it('should handle SESSION_PROFILE', () => {
    expect(reducer({ isCBE: false }, { type: a.SESSION_PROFILE, profile, isCBE: true }))
      .toEqual({
        profile,
        isCBE: true,
      })
  })

  it('should handle SESSION_PROFILE_UPDATE', () => {
    const updatedProfile = new ProfileModel({ name: 'updated' })
    expect(reducer({ profile }, { type: a.SESSION_PROFILE_UPDATE, profile: updatedProfile }))
      .toEqual({
        profile: updatedProfile,
      })
  })
})
