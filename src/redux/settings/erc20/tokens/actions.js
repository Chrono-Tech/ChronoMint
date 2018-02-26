import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { change } from 'redux-form/immutable'
import BigNumber from 'bignumber.js'
import { address } from 'models/validator'
import type AbstractFetchingModel from 'models/AbstractFetchingModel'
import type TokenNoticeModel from 'models/notices/TokenNoticeModel'
import type TokenModel from 'models/tokens/TokenModel'
import { I18n } from 'platform/i18n'
import { notify } from 'redux/notifier/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { checkFetched, TOKENS_FETCHED, TOKENS_REMOVE, TOKENS_UPDATE } from 'redux/tokens/actions'
import tokenService from 'services/TokenService'
import Amount from 'models/Amount'
import ERC20DAO from 'dao/ERC20DAO'
import { FORM_CBE_TOKEN } from 'components/dialogs/CBETokenDialog/CBETokenDialog'

export const DUCK_SETTINGS_ERC20_TOKENS = 'settingsERC20Tokens'

export const TOKENS_FORM = 'settings/TOKENS_FORM'
export const TOKENS_FORM_FETCH = 'settings/TOKENS_FORM_FETCH'

const setToken = (token: TokenModel) => ({ type: TOKENS_UPDATE, token })
const removeToken = (token: TokenModel) => ({ type: TOKENS_REMOVE, token })

export const watchToken = (notice: TokenNoticeModel) => async (dispatch, getState) => {

  const token = notice.token().isFetching(false).isFetched(true).isERC20(true)
  if (notice.token()) {
    dispatch({ type: TOKENS_REMOVE, token: notice.oldAddress() })
    dispatch({ type: TOKENS_FETCHED, token })
    tokenService.createDAO(token)
    dispatch(checkFetched())
  }

  dispatch(notice.isRemoved()
    ? removeToken(token)
    : setToken(token))

  if (getState().get(DUCK_SESSION).isCBE) {
    dispatch(notify(notice))
  }
}

export const watchInitERC20Tokens = () => async (dispatch) => {
  const callback = (notice) => dispatch(watchToken(notice))

  const dao = await contractsManagerDAO.getERC20ManagerDAO()

  return Promise.all([
    dao.watchAdd(callback),
    dao.watchModify(callback),
    dao.watchRemove(callback),
  ])
}

export const formTokenLoadMetaData = async (token: TokenModel, dispatch, ownProps) => {
  let errors = {}
  dispatch({ type: TOKENS_FORM_FETCH })
  const managerDAO = await contractsManagerDAO.getERC20ManagerDAO()
  const symbolAddress = token.symbol() && await managerDAO.getTokenAddressBySymbol(token.symbol())

  if (ownProps.tokens.getByAddress(token.address()).isFetched() && !ownProps.isModify) {
    errors.address = I18n.t('settings.erc20.tokens.errors.addressInUse')
  }

  if ((symbolAddress !== null && token.address() !== symbolAddress) || (token.symbol() && token.symbol().toUpperCase() === 'ETH')) {
    errors.symbol = I18n.t('settings.erc20.tokens.errors.symbolInUse')
  }

  dispatch({ type: TOKENS_FORM_FETCH, end: true })
  if (Object.values(errors).length) {
    throw errors
  }
}

export const addToken = (token: TokenModel | AbstractFetchingModel) => async (dispatch) => {
  dispatch(setToken(token.isFetching(true)))
  const dao = await contractsManagerDAO.getERC20ManagerDAO()
  try {
    await dao.addToken(token)
  } catch (e) {
    dispatch(removeToken(token))
  }
}

export const modifyToken = (oldToken: TokenModel | AbstractFetchingModel, newToken: TokenModel) => async (dispatch) => {
  dispatch(removeToken(oldToken))
  dispatch(setToken(newToken.isFetching(true)))
  const dao = await contractsManagerDAO.getERC20ManagerDAO()
  try {
    await dao.modifyToken(oldToken, newToken.totalSupply(new Amount(0, newToken.symbol())))
  } catch (e) {
    dispatch(removeToken(newToken))
    dispatch(setToken(oldToken))
  }
}

export const revokeToken = (token: TokenModel | AbstractFetchingModel) => async (dispatch) => {
  dispatch(setToken(token.isFetching(true)))
  const dao = await contractsManagerDAO.getERC20ManagerDAO()
  try {
    await dao.removeToken(token)
  } catch (e) {
    dispatch(setToken(token.isFetching(false)))
  }
}

export const getDataFromContract = (token) => async (dispatch) => {
  dispatch({ type: TOKENS_FORM_FETCH })
  if (!address(token.address())) {
    const dao = new ERC20DAO(token)
    const symbol = await dao.getSymbolFromContract()
    const decimals = new BigNumber(await dao.getDecimalsFromContract())

    if (symbol) { // check only the symbol, because token can have decimal values of 0
      dispatch(change(FORM_CBE_TOKEN, 'symbol', symbol))
      dispatch(change(FORM_CBE_TOKEN, 'decimals', decimals))
    }

  }
  dispatch({ type: TOKENS_FORM_FETCH, end: true })
}
