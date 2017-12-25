import { EVENT_NEW_TOKEN } from '@/services/TokenService'
import { nemProvider } from '@chronobank/login/network/NemProvider'
import { bccDAO, BitcoinDAO, btcDAO, btgDAO, EVENT_BTC_LIKE_TOKEN_CREATED, EVENT_BTC_LIKE_TOKEN_FAILED, ltcDAO } from 'dao/BitcoinDAO'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ERC20ManagerDAO, { EVENT_ERC20_TOKENS_COUNT, EVENT_NEW_ERC20_TOKEN } from 'dao/ERC20ManagerDAO'
import ethereumDAO from 'dao/EthereumDAO'
import NemDAO, { EVENT_NEM_LIKE_TOKEN_CREATED, EVENT_NEM_LIKE_TOKEN_FAILED } from 'dao/NemDAO'
import TokenModel from 'models/tokens/TokenModel'
import tokenService from 'services/TokenService'

export const DUCK_TOKENS = 'tokens'
export const TOKENS_UPDATE = 'tokens/update'
export const TOKENS_INIT = 'tokens/init'
export const TOKENS_FETCHING = 'tokens/fetching'
export const TOKENS_FETCHED = 'tokens/fetched'
export const TOKENS_REMOVE = 'tokens/remove'
export const TOKENS_FAILED = 'tokens/failed'

// add new tokens here
const MANDATORY_TOKENS_COUNT = ['TIME', 'BTC', 'BCC', 'ETH', 'LTC', 'BTG', 'XEM', 'XMIN']

// TODO @dkchv: remove after subscriptions changes in exchange
export const checkFetched = () => (dispatch, getState) => {
  const tokens = getState().get(DUCK_TOKENS)
  if (tokens.isFetched()) {
    tokenService.tokensFetched()
  }
}

export const initTokens = () => async (dispatch, getState) => {
  if (getState().get(DUCK_TOKENS).isInited()) {
    return
  }
  dispatch({ type: TOKENS_INIT, isInited: true })

  dispatch({ type: TOKENS_FETCHING, count: MANDATORY_TOKENS_COUNT.length })

  // eth
  const eth: TokenModel = ethereumDAO.getToken()
  if (eth) {
    dispatch({ type: TOKENS_FETCHED, token: eth })
    tokenService.registerDAO(eth, ethereumDAO)
  }

  const erc20: ERC20ManagerDAO = await contractsManagerDAO.getERC20ManagerDAO()
  erc20
    .on(EVENT_ERC20_TOKENS_COUNT, (count) => {
      // TIME is already counted in mandatory list, so decrement
      // also this hack is needed to prevent isFetched=true before erc20 tokens are fetched
      const currentCount = getState().get(DUCK_TOKENS).leftToFetch() - 1
      dispatch({ type: TOKENS_FETCHING, count: currentCount + count })
    })
    .on(EVENT_NEW_ERC20_TOKEN, (token: TokenModel) => {
      dispatch({ type: TOKENS_FETCHED, token })
      tokenService.createDAO(token)
      dispatch(checkFetched())
    })
    .fetchTokens()

  // btc-likes
  const btcLikeTokens = [ btcDAO, bccDAO, btgDAO, ltcDAO ]
  btcLikeTokens.forEach((btcLikeDAO: BitcoinDAO) => {
    btcLikeDAO
      .on(EVENT_BTC_LIKE_TOKEN_CREATED, (token, dao) => {
        dispatch({ type: TOKENS_FETCHED, token })
        tokenService.registerDAO(token, dao)
        dispatch(checkFetched())
      })
      .on(EVENT_BTC_LIKE_TOKEN_FAILED, () => {
        dispatch({ type: TOKENS_FAILED })
        dispatch(checkFetched())
      })
      .fetchToken()
  })

  // nem tokens
  const mosaicsDAOs = nemProvider.getMosaics().map((m) => new NemDAO(m.name, m.symbol, nemProvider, m.namespace, 2))
  const nemDAOs =  [
    new NemDAO('XEM', 'XEM', nemProvider, null, 6),
    ...mosaicsDAOs,
  ]

  nemDAOs.forEach((nemDAO: NemDAO) => {
    nemDAO
      .on(EVENT_NEM_LIKE_TOKEN_FAILED, () => {
        dispatch({ type: TOKENS_FAILED })
        dispatch(checkFetched())
      })
      .on(EVENT_NEM_LIKE_TOKEN_CREATED, (token: TokenModel, dao) => {
        dispatch({ type: TOKENS_FETCHED, token })
        tokenService.registerDAO(token, dao)
        dispatch(checkFetched())
      })
      .fetchToken()
  })
}

export const subscribeOnTokens = (callback) => (dispatch, getState) => {
  const handleToken = (token) => dispatch(callback(token))
  tokenService.on(EVENT_NEW_TOKEN, handleToken)
  // fetch for existing tokens
  const tokens = getState().get(DUCK_TOKENS)
  tokens.list().forEach(handleToken)
}
