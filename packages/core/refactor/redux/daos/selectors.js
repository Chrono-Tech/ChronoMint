import { createSelector } from 'reselect'

export const daosSelector = () => (state) => state.daos

export const daoByAddress = (address) => createSelector(
  daosSelector(),
  (daos) => (address in daos.byAddress)
    ? daos.byAddress[address].dao
    : null
)

export const daoByType = (type) => createSelector(
  daosSelector(),
  (daos) => (type in daos.byType)
    ? daos.byType[type].dao
    : null
)

export const isFrontendInitialized = () => createSelector(
  daosSelector(),
  daos => daos.isInitialized
)
