/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import { getAssetsFromAssetHolder, getAssetsHolderAssets } from './selectors/models'
import Amount from '../../models/Amount'
import { getTimeToken } from '../tokens/selectors'

export { getAssetsFromAssetHolder, getAssetsHolderAssets }

const getDepositFromDuck = createSelector(
  [
    getAssetsHolderAssets,
    getTimeToken,
  ],
  (assetsHolderAssets, timeToken) => {
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

    let keysA = Object.keys(objA)
    let keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) {
      return false
    }

    // Test for A's keys different from B.
    let bHasOwnProperty = hasOwnProperty.bind(objB)
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

