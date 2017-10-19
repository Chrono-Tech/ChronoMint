import { GET_ASSETS_MANAGER_COUNTS, GET_PLATFORMS, GET_PLATFORMS_COUNT, GET_TOKENS } from './actions'

const initialState = {
  platformsCount: 0,
  tokensCount: 0,
  managersCount: 0,
  tokensOnCrowdsaleCount: 0,
  platformsList: [],
  tokensMap: new Map(),
  managersList: [],
  assets: {},
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

    case GET_TOKENS:
      return {
        ...initialState,
        ...state,
        tokensCount: action.payload.tokensMap.size,
        tokensMap: action.payload.tokensMap,
        assets: action.payload.assets,
      }

    default:
      return state
  }
}
