import { GET_ASSETS_MANAGER_COUNTS, GET_PLATFORMS, GET_PLATFORMS_COUNT } from './actions'

const initialState = {
  platformsCount: 0,
  tokensCount: 0,
  managersCount: 0,
  tokensOnCrowdsaleCount: 0,
  platformsList: [],
  tokensList: [],
  managersList: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PLATFORMS_COUNT:
      return {
        ...initialState,
        ...state,
        platformsCount: action.payload.platformCount
      }
    case GET_ASSETS_MANAGER_COUNTS:
      return {
        ...initialState,
        ...state,
        platformsCount: action.payload.platforms.length,
        tokensCount: action.payload.tokens.length,
        managersCount: action.payload.managers.length,
        tokensList: action.payload.tokens,
        managersList: action.payload.managers,
        platformsList: action.payload.platforms
      }
    case GET_PLATFORMS:
      return {
        ...initialState,
        ...state,
        platformsList: action.payload.platforms
      }

    default:
      return state
  }
}
