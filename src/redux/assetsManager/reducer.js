import {
  GET_ASSETS_MANAGER_COUNTS,
  GET_MANAGERS_FOR_TOKEN,
  GET_PLATFORMS,
  GET_PLATFORMS_COUNT,
  GET_TOKENS,
  SELECT_PLATFORM,
  SELECT_TOKEN,
  GET_MANAGERS_FOR_TOKEN_LOADING, SET_WATCHERS,
  SET_TOTAL_SUPPLY, GET_TRANSACTIONS, GET_TRANSACTIONS_START, GET_TRANSACTIONS_DONE, SET_TOKEN
} from './actions'

const initialState = {
  selectedToken: null,
  selectedPlatform: null,
  platformsCount: 0,
  tokensCount: 0,
  managersCount: 0,
  tokensOnCrowdsaleCount: 0,
  platformsList: [],
  tokensMap: new Map(),
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
    case GET_ASSETS_MANAGER_COUNTS:
      return {
        ...initialState,
        ...state,
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
