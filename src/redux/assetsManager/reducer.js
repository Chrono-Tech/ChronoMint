import Immutable from 'immutable'
import {
  GET_ASSETS_MANAGER_COUNTS,
  GET_ASSETS_MANAGER_COUNTS_START,
  GET_MANAGERS_FOR_TOKEN,
  GET_MANAGERS_FOR_TOKEN_LOADING,
  GET_PLATFORMS,
  GET_PLATFORMS_COUNT,
  GET_TOKENS,
  GET_TRANSACTIONS_DONE,
  GET_TRANSACTIONS_START,
  SELECT_PLATFORM,
  SELECT_TOKEN,
  SET_FEE,
  SET_IS_REISSUABLE,
  SET_NEW_MANAGERS_LIST,
  SET_TOKEN,
  SET_TOTAL_SUPPLY,
  SET_WATCHERS,
} from './actions'

const initialState = {
  assetsManagerCountsLoading: false,
  selectedToken: null,
  selectedPlatform: null,
  platformsCount: 0,
  tokensCount: 0,
  managersCount: 0,
  tokensOnCrowdsaleCount: 0,
  platformsList: [],
  tokensMap: new Immutable.Map(),
  managersList: [],
  assets: {},
  managersForTokenLoading: false,
  watchers: {},
  transactionsList: [],
  transactionsFetched: false,
  transactionsFetching: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PLATFORMS_COUNT:
      return {
        ...initialState,
        ...state,
        platformsCount: action.payload.platformCount,
      }
    case GET_ASSETS_MANAGER_COUNTS_START:
      return {
        ...initialState,
        ...state,
        assetsManagerCountsLoading: true,
      }
    case GET_ASSETS_MANAGER_COUNTS:
      return {
        ...initialState,
        ...state,
        assetsManagerCountsLoading: false,
        platformsCount: action.payload.platforms.length,
        tokensCount: Object.keys(action.payload.assets).length,
        managersCount: action.payload.managers.length,
        assets: action.payload.assets,
        managersList: action.payload.managers,
        platformsList: action.payload.platforms,
      }
    case GET_PLATFORMS:
      return {
        ...initialState,
        ...state,
        platformsCount: action.payload.platforms.length,
        platformsList: action.payload.platforms,
      }
    case GET_MANAGERS_FOR_TOKEN_LOADING :
      return {
        ...initialState,
        ...state,
        managersForTokenLoading: true,
      }
    case SELECT_TOKEN:
      return {
        ...initialState,
        ...state,
        selectedToken: action.payload.symbol,
      }
    case SELECT_PLATFORM:
      return {
        ...initialState,
        ...state,
        selectedPlatform: action.payload.platformAddress,
      }
    case GET_TOKENS:
      return {
        ...initialState,
        ...state,
        tokensCount: action.payload.tokensMap.size,
        tokensMap: action.payload.tokensMap,
        assets: action.payload.assets,
      }
    case SET_TOKEN:
      return {
        ...initialState,
        ...state,
        tokensCount: state.tokensMap.concat(action.payload.tokensMap).size,
        tokensMap: state.tokensMap.concat(action.payload.tokensMap),
        assets: action.payload.assets,
      }
    case GET_MANAGERS_FOR_TOKEN:
      return {
        ...initialState,
        ...state,
        tokensMap: state.tokensMap.setIn([action.payload.symbol, 'managersList'], action.payload.managersForAssetSymbol),
        managersForTokenLoading: false,
      }
    case SET_WATCHERS:
      return {
        ...initialState,
        ...state,
        watchers: {
          ...state.watchers,
          ...action.payload.watchers,
        },
      }
    case SET_TOTAL_SUPPLY:
      return {
        ...initialState,
        ...state,
        tokensMap: state.tokensMap.setIn([action.payload.symbol, 'totalSupply'], action.payload.totalSupply),
        assets: {
          ...state.assets,
          [state.tokensMap.get(action.payload.symbol).address()]: {
            ...state.assets[action.payload.symbol],
            totalSupply: action.payload.totalSupply,
          },
        },
      }
    case SET_IS_REISSUABLE:
      return {
        ...initialState,
        ...state,
        tokensMap: state.tokensMap.setIn([action.payload.symbol, 'isReissuable'], action.payload.isReissuable),
      }
    case SET_FEE:
      let newTokensMap = state.tokensMap.setIn([action.payload.symbol, 'fee'], action.payload.fee)
      newTokensMap = newTokensMap.setIn([action.payload.symbol, 'withFee'], action.payload.withFee)
      return {
        ...initialState,
        ...state,
        tokensMap: newTokensMap,
      }
    case SET_NEW_MANAGERS_LIST:
      return {
        ...initialState,
        ...state,
        tokensMap: state.tokensMap.setIn([action.payload.symbol, 'managersList'], action.payload.managersList),
        managersList: action.payload.managers,
        managersCount: action.payload.managers.length,
      }
    case GET_TRANSACTIONS_START:
      return {
        ...initialState,
        ...state,
        transactionsList: [],
        transactionsFetched: false,
        transactionsFetching: true,
      }
    case GET_TRANSACTIONS_DONE:
      return {
        ...initialState,
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
