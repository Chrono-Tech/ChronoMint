import * as a from './actions'

const initialState = {
  isHttps: window.location.protocol === 'https:',
  isU2F: false,
  isETHAppOpened: false,
  isFetching: false,
  isFetched: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.TREZOR_SET_U2F:
      return {
        ...state,
        isU2F: action.isU2F,
      }
    case a.TREZOR_SET_ETH_APP_OPENED:
      return {
        ...state,
        isETHAppOpened: action.isETHAppOpened,
      }
    case a.TREZOR_FETCHING:
      return {
        ...state,
        isFetching: true,
      }
    case a.TREZOR_FETCHED:
      return {
        ...state,
        isFetched: action.isFetched,
        isFetching: false,
      }
    default:
      return state
  }
}
