import { bccDAO, btcDAO } from 'dao/BitcoinDAO'
import ethDAO from 'dao/EthereumDAO'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ERC20ManagerDAO, { EVENT_ERC20_TOKENS_COUNT, EVENT_NEW_ERC20_TOKEN } from 'dao/ERC20ManagerDAO'
import TokenModel from 'models/tokens/TokenModel'
import tokenService from 'services/TokenService'

export const DUCK_TOKENS = 'tokens'
export const TOKENS_UPDATE = 'tokens/update'
export const TOKENS_INIT = 'tokens/init'
export const TOKENS_FETCHING = 'tokens/fetching'
export const TOKENS_FETCHED = 'tokens/fetched'

// increment on new tokens.
// [BTC, BCC, ETH]
const NON_ERC20_TOKENS_COUNT = 3

export const initTokens = () => async (dispatch, getState) => {
  if (getState().get(DUCK_TOKENS).isInited()) {
    return
  }
  dispatch({ type: TOKENS_INIT, isInited: true })
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

  // btc
  const btc: TokenModel = btcDAO.getToken()
  if (btc) {
    dispatch({ type: TOKENS_FETCHED, token: btc })
    tokenService.registerDAO(btc, btcDAO)
  }

  // bcc
  const bcc: TokenModel = bccDAO.getToken()
  if (bcc) {
    dispatch({ type: TOKENS_FETCHED, token: bcc })
    tokenService.registerDAO(bcc, bccDAO)
  }

  // eth
  const eth: TokenModel = ethDAO.getToken()
  if (eth) {
    dispatch({ type: TOKENS_FETCHED, token: eth })
    tokenService.registerDAO(eth, ethDAO)
  }
}
