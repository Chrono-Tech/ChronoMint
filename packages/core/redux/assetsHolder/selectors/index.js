/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import { getAssetsHolderAssets } from './models'
import Amount from '../../../models/Amount'
import { getTokens } from '../../tokens/selectors'
import { TIME } from '../../../dao/constants'

export { getAssetsHolderAssets }

const getDepositFromDuck = createSelector(
  [
    getAssetsHolderAssets,
    getTokens,
  ],
  (assetsHolderAssets, tokens) => {
    const timeToken = tokens.item(TIME)
    if (timeToken.isFetched()) {
      return assetsHolderAssets.item(timeToken.address()).deposit()
    }
    return new Amount()
  },
)

const createSectionsSelector = createSelectorCreator(
  defaultMemoize,
  (objA, objB) => {
    if (objA === objB) {
      return true
    }

    if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
      return false
    }

    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) {
      return false
    }

    // Test for A's keys different from B.
    const bHasOwnProperty = hasOwnProperty.bind(objB)
    for (let i = 0; i < keysA.length; i++) {
      if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
        return false
      }
    }

    return true
  },
)

export const getDepositAmount = () => createSectionsSelector(
  [
    getDepositFromDuck,
  ],
  (
    deposit,
  ) => deposit,
)

