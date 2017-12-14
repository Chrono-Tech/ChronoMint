import { bccDAO, BitcoinDAO, btcDAO, btgDAO, EVENT_NEW_BTC_LIKE_TOKEN, ltcDAO } from 'dao/BitcoinDAO'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ERC20ManagerDAO, { EVENT_ERC20_TOKENS_COUNT, EVENT_NEW_ERC20_TOKEN } from 'dao/ERC20ManagerDAO'
import ethereumDAO from 'dao/EthereumDAO'
import TokenModel from 'models/tokens/TokenModel'
import tokenService from 'services/TokenService'

export const DUCK_TOKENS = 'tokens'
export const TOKENS_UPDATE = 'tokens/update'
export const TOKENS_INIT = 'tokens/init'
export const TOKENS_FETCHING = 'tokens/fetching'
export const TOKENS_FETCHED = 'tokens/fetched'
export const TOKENS_REMOVE = 'tokens/remove'

// increment on new tokens.
// [BTC, BCC, ETH, LTC, BTG]
const NON_ERC20_TOKENS_COUNT = 5

export const initTokens = () => async (dispatch, getState) => {
  if (getState().get(DUCK_TOKENS).isInited()) {
    return
  }
  dispatch({ type: TOKENS_INIT, isInited: true })

  // eth
  const eth: TokenModel = ethereumDAO.getToken()
  if (eth) {
    dispatch({ type: TOKENS_FETCHED, token: eth })
    tokenService.registerDAO(eth, ethereumDAO)
  }

  // erc20
  const erc20: ERC20ManagerDAO = await contractsManagerDAO.getERC20ManagerDAO()
  erc20.on(EVENT_ERC20_TOKENS_COUNT, (count) => {
    dispatch({ type: TOKENS_FETCHING, count: count + NON_ERC20_TOKENS_COUNT })
  })
  erc20.on(EVENT_NEW_ERC20_TOKEN, (token: TokenModel) => {
    dispatch({ type: TOKENS_FETCHED, token })
    tokenService.createDAO(token)
  })
  erc20.fetchTokens()

  // btc-likes
  const btcLikeTokens = [ btcDAO, bccDAO, btgDAO, ltcDAO ]
  btcLikeTokens.forEach((btcLikeDAO: BitcoinDAO) => {
    btcLikeDAO.on(EVENT_NEW_BTC_LIKE_TOKEN, (token, dao) => {
      dispatch({ type: TOKENS_FETCHED, token })
      tokenService.registerDAO(token, dao)
    })
    btcLikeDAO.fetchToken()
  })
}
