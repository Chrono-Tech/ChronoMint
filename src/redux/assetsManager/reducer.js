import {
  GET_ASSETS_MANAGER_COUNTS, GET_ASSETS_MANAGER_COUNTS_START, GET_PLATFORMS, GET_TRANSACTIONS_DONE,
  GET_TRANSACTIONS_START, GET_USER_PLATFORMS, SELECT_PLATFORM, SELECT_TOKEN, SET_ASSETS, SET_NEW_MANAGERS_LIST,
} from './actions'

export const initialState = {
  usersPlatforms: [],
  usersPlatformsCount: 0,
  assetsManagerCountsLoading: false,
  selectedToken: null,
  selectedPlatform: null,
  managersCount: 0,
  tokensOnCrowdsaleCount: 0,
  platformsList: [],
  assets: {},
  watchers: {},
  transactionsList: [],
  transactionsFetched: false,
  transactionsFetching: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ASSETS_MANAGER_COUNTS_START:
      return {
        ...state,
        assetsManagerCountsLoading: true,
      }
    case GET_ASSETS_MANAGER_COUNTS:
      return {
        ...state,
        assetsManagerCountsLoading: false,
        managersCount: action.payload.managers.length,
        assets: action.payload.assets,
        platformsList: action.payload.platforms,
        usersPlatforms: action.payload.usersPlatforms,
        usersPlatformsCount: action.payload.usersPlatforms.length,
      }
    case GET_PLATFORMS:
      return {
        ...state,
        platformsList: action.payload.platforms,
        usersPlatforms: action.payload.usersPLatforms,
        usersPlatformsCount: action.payload.usersPLatforms.length,
      }
    case SELECT_TOKEN:
      return {
        ...state,
        selectedToken: action.payload.symbol,
      }
    case SELECT_PLATFORM:
      return {
        ...state,
        selectedPlatform: action.payload.platformAddress,
      }
    case SET_ASSETS:
      return {
        ...state,
        assets: action.payload.assets,
      }
    case SET_NEW_MANAGERS_LIST:
      return {
        ...state,
        managersCount: action.payload.managers.length,
      }
    case GET_TRANSACTIONS_START:
      return {
        ...state,
        transactionsFetching: true,
      }
    case GET_TRANSACTIONS_DONE:
      return {
        ...state,
        transactionsList: [
          ...state.transactionsList,
          ...action.payload.transactionsList,
        ],
        transactionsFetched: true,
        transactionsFetching: false,
      }
    default:
      return state
  }
}
