/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import MainAssetsManagerModel from '../../models/assetsManager/MainAssetsManagerModel'
import {
  GET_ASSETS_MANAGER_COUNTS,
  GET_ASSETS_MANAGER_COUNTS_START,
  GET_PLATFORMS,
  GET_TRANSACTIONS_DONE,
  GET_TRANSACTIONS_START,
  SELECT_PLATFORM,
  SELECT_TOKEN,
  SET_ASSETS,
  SET_NEW_MANAGERS_LIST,
  GET_ASSET_DATA,
} from './constants'

export const initialState = new MainAssetsManagerModel()

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ASSETS_MANAGER_COUNTS_START:
      return state.isFetching(true).isFetched(false)
    case GET_ASSETS_MANAGER_COUNTS:
      return state
        .isFetching(false)
        .isFetched(true)
        .managersCount(action.payload.managers.length || 0)
        .assets(action.payload.assets)
        .platformsList(action.payload.platforms)
        .usersPlatforms(action.payload.usersPlatforms)
    case GET_ASSET_DATA:
      return state
        .assets({
          ...state.assets(),
          [ action.asset.token ]: action.asset,
        })
    case GET_PLATFORMS:
      return state
        .platformsList(action.payload.platforms)
        .usersPlatforms(action.payload.usersPlatforms)
    case SELECT_TOKEN:
      return state.selectedToken(action.payload.symbol)
    case SELECT_PLATFORM:
      return state.selectedPlatform(action.payload.platformAddress)
    case SET_ASSETS:
      return state.assets(action.payload.assets)
    case SET_NEW_MANAGERS_LIST:
      return state.managersCount(action.payload.managers.length)
    case GET_TRANSACTIONS_START:
      return state
        .transactionsList(
          state.transactionsList()
            .isFetched(false)
            .isFetching(true),
        )
    case GET_TRANSACTIONS_DONE:
      return state
        .transactionsList(
          state.transactionsList()
            .merge(action.payload.transactionsList)
            .isFetched(true)
            .isFetching(false),
        )
    default:
      return state
  }
}
