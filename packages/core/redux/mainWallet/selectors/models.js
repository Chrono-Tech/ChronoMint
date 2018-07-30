/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getAssetsHolderAssets } from '../../assetsHolder/selectors'
import { getTokens } from '../../tokens/selectors'

export const getDeposit = (tokenId) => createSelector(
  [getAssetsHolderAssets, getTokens],
  (assets, tokens) => {
    const token = tokens.item(tokenId)
    return assets.item(token.address()).deposit()
  },
)
