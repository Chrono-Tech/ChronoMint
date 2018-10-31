/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'

import { DUCK_LABOR_HOUR } from './constants'

const laborHourSelector = () => (state) => state.get(DUCK_LABOR_HOUR)

export const web3Selector = () => createSelector(
  laborHourSelector(),
  (laborHour) => laborHour == null ? null : laborHour.web3.value,
)
