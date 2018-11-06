/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_LABOR_HOUR } from '../constants'

export const LXSDuckSelector = (state) => {
  return state.get(DUCK_LABOR_HOUR)
}

export const web3Selector = () => createSelector(
  LXSDuckSelector,
  (laborHour) => {
    return laborHour == null ? null : laborHour.web3.value
  },
)

export const daosSelector = (state) => {
  const { daos } = LXSDuckSelector(state)
  return daos
}

export const getLXWeb3 = (state) => {
  const { web3 } = LXSDuckSelector(state)
  return web3
}

export const daoByAddress = (address) => createSelector(
  daosSelector,
  (daos) => (address in daos.byAddress)
    ? daos.byAddress[address].dao
    : null,
)

export const daoByType = (type) => createSelector(
  daosSelector,
  (daos) => {
    return (type in daos.byType)
      ? daos.byType[type].dao
      : null
  },
)

export const getLXTokens = (state) => {
  const { tokens } = LXSDuckSelector(state)
  return tokens
}

export const getLXToken = (symbol) => createSelector(
  getLXTokens,
  (tokens) => {
    return tokens.item(symbol)
  },
)

export const getLXTokenByAddress = (address) => createSelector(
  getLXTokens,
  (tokens) => {
    return tokens.getByAddress(address)
  },
)
