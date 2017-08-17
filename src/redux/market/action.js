export const MARKET_INIT = 'market/INIT'
export const MARKET_ADD_TOKEN = 'market/ADD_TOKEN'
export const MARKET_UPDATE_PRICES = 'market/UPDATE_PRICES'

const MARKET_REQUEST_DELAY = 1000
let timerId

const watchMarket = (dispatch, getState) => () => {
  // TODO @dkchv: !!!
  clearInterval(timerId)
  const market = getState().get('market')
  const tokens = market.tokens.join(',')
  const currencies = market.currencies.join(',')
  if (!tokens || !currencies) {
    return
  }
  fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tokens}&tsyms=${currencies}`).then(response => {
    return response ? response.json() : {}
  }).then(prices => {
    dispatch({type: MARKET_UPDATE_PRICES, prices})
  })
}

export const watchInitMarket = () => (dispatch, getState) => {
  timerId = setInterval(watchMarket(dispatch, getState), MARKET_REQUEST_DELAY)
  dispatch({type: MARKET_INIT, isInited: true})
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
