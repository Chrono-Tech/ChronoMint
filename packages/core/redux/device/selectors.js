/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_DEVICE_ACCOUNT } from './constants'
import DeviceEntryModel from '../../models/device/DeviceEntryModel'

export const deviceDuckSelector = () => (state) => state.get(DUCK_DEVICE_ACCOUNT)

export const deviceListSelector = createSelector(
  deviceDuckSelector(),
  ({ deviceList }) => {
    return deviceList.map(
      (wallet) => new DeviceEntryModel({ ...wallet }),
    )
  },
)
