import TokenModel from 'models/TokenModel'
import ERC20ManagerDAO from 'dao/ERC20ManagerDAO'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { btcDAO, bccDAO } from 'dao/BitcoinDAO'
import tokenService from 'services/TokenService'

export const DUCK_TOKENS = 'tokens'
export const TOKENS_UPDATE = 'tokens/update'
export const TOKENS_INIT = 'tokens/init'

export const initTokens = () => async (dispatch, getState) => {
  if (getState().get(DUCK_TOKENS).isInited()) {
    return
  }
  dispatch({ type: TOKENS_INIT, isInited: true })
  // erc20
  const erc20: ERC20ManagerDAO = await contractsManagerDAO.getERC20ManagerDAO()
  const tokens = await erc20.getTokens()
  tokens.forEach((token: TokenModel) => {
    dispatch({ type: TOKENS_UPDATE, token })
    tokenService.createDAO(token)
  })

  // btc
  const btc: TokenModel = btcDAO.getToken()
  if (btc) {
    dispatch({ type: TOKENS_UPDATE, token: btc })
    tokenService.registerDAO(btc, btcDAO)
  }

  // bcc
  const bcc: TokenModel = bccDAO.getToken()
  if (bcc) {
    dispatch({ type: TOKENS_UPDATE, token: bcc })
    tokenService.registerDAO(bcc, bccDAO)
  }
}
