export const MARKET_INIT = 'market/INIT'
export const MARKET_ADD_TOKEN = 'market/ADD_TOKEN'
export const MARKET_UPDATE_PRICES = 'market/UPDATE_PRICES'

const MARKET_REQUEST_DELAY = 30000
let timerId

const watchMarket = (dispatch, getState) => async () => {
  const {tokens, currencies } = getState().get('market')
  if (tokens.length === 0 || !currencies.length === 0) {
    return
  }
  const response = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tokens.join(',')}&tsyms=${currencies.join(',')}`)
  const prices = response ? await response.json() : {}
  dispatch({type: MARKET_UPDATE_PRICES, prices})
}

export const watchInitMarket = () => async (dispatch, getState) => {
  try {
    watchMarket(dispatch, getState)()
    timerId = setInterval(watchMarket(dispatch, getState), MARKET_REQUEST_DELAY)
    dispatch({type: MARKET_INIT, isInited: true})
  } catch (e) {
    // eslint-disable-next-line
    console.error('init market error', e)
    dispatch({type: MARKET_INIT, isInited: false})
  }
}

export const watchStopMarket = () => (dispatch) => {
  if (timerId) {
    clearInterval(timerId)
  }
  dispatch({type: MARKET_INIT, isInited: false})
}

export const addMarketToken = (symbol: string) => (dispatch) => {
  dispatch({type: MARKET_ADD_TOKEN, symbol})
}
