/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getIsHave2FAWalletsFromState, getTwoFaCheckedFromState } from './models'

export const getTwoFaChecked = createSelector(
  [
    getTwoFaCheckedFromState,
  ],
  (
    twoFAConfirmed,
  ) => twoFAConfirmed,
)
export const isHave2FAWallets = createSelector(
  [
    getIsHave2FAWalletsFromState,
  ],
  (
    isTwoFA,
  ) => isTwoFA,
)
