import { createSelector } from 'reselect'
import { PocketModel } from 'src/models'

export const tokensSelector = () => (state) => state.tokens

export const tokenByAddress = (address) => createSelector(
  tokensSelector(),
  (tokens) => (address in tokens.byAddress)
    ? tokens.byAddress[address]
    : null
)

export const tokenByKey = (key) => createSelector(
  tokensSelector(),
  (tokens) => (key in tokens.byKey)
    ? tokens.byKey[key]
    : null
)

export const ethTokenSelector = () => createSelector(
  tokensSelector(),
  (tokens) => tokens.eth
)

export const ethPocketSelector = (address) => createSelector(
  ethTokenSelector(),
  (token) => token === null
    ? null
    : new PocketModel({
      token,
      address,
    })
)
