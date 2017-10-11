import { GET_PLATFORMS, GET_PLATFORMS_COUNT } from './actions'

const initialState = {
  platformsCount: 0,
  tokensCount: 0,
  managersCount: 0,
  tokensOnCrowdsaleCount: 0,
  platformsList: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PLATFORMS_COUNT:
      return {
        ...initialState,
        ...state,
        platformsCount: action.payload.platformCount
      }
    case GET_PLATFORMS:
      return {
        ...initialState,
        ...state,
        platformsList: action.payload.platformsList
      }

    default:
      return state
  }
}
