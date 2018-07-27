/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NETWORK } from './actions'

export const getProfileSignatureSelector = () => createSelector(
  (state) => state.get(DUCK_NETWORK),
  (network) => {
    const { profileSignature } = network

    return profileSignature && profileSignature.profile
  },
)

export const getAccountProfileSummary = () => createSelector(
  [getProfileSignatureSelector],
  (profile) => {
    if (profile){
      const level1 = profile.level1.submitted
      const level2 = profile.level2.submitted

      return {
        name: level1 && level1.userName,
        company: level2 && level2.company,
        phone: level2 && level2.phone,
        website: level2 && level2.website,
        avatar: level1 && level1.avatar && level1.avatar.url,
      }
    }
  }
)
