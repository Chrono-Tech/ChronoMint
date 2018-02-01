import { change, Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import validator from 'models/validator'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import type AbstractFetchingModel from 'models/AbstractFetchingModel'
import type TokenNoticeModel from 'models/notices/TokenNoticeModel'
import type TokenModel from 'models/tokens/TokenModel'
import { I18n } from 'platform/i18n'
import { TIME } from 'redux/mainWallet/actions'
import { notify } from 'redux/notifier/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { checkFetched, TOKENS_FETCHED } from 'redux/tokens/actions'
import tokenService from 'services/TokenService'
import Amount from 'models/Amount'
import ERC20DAO from 'dao/ERC20DAO'
import { FORM_CBE_TOKEN } from 'components/dialogs/CBETokenDialog/CBETokenDialog'

export const DUCK_SETTINGS_ERC20_TOKENS = 'settingsERC20Tokens'

export const TOKENS_LIST = 'settings/TOKENS_LIST'
export const TOKENS_SET = 'settings/TOKENS_SET'
export const TOKENS_REMOVE = 'settings/TOKENS_REMOVE'
export const TOKENS_FORM = 'settings/TOKENS_FORM'
export const TOKENS_FORM_FETCH = 'settings/TOKENS_FORM_FETCH'

const setToken = (token: TokenModel) => ({ type: TOKENS_SET, token })
const removeToken = (token: TokenModel) => ({ type: TOKENS_REMOVE, token })

export const watchToken = (notice: TokenNoticeModel) => async (dispatch, getState) => {

  if (notice.token()) {
    const token = notice.token().isFetching(false).isFetched(true)
    dispatch({ type: TOKENS_FETCHED, token: token.isERC20(true) })
    tokenService.createDAO(token.isERC20(true))
    dispatch(checkFetched())
  }
  if (notice.isModified()) {
    for (const token: TokenModel of getState().get(DUCK_SETTINGS_ERC20_TOKENS).list.valueSeq().toArray()) {
      if (token.address() === notice.oldAddress()) {
        dispatch(removeToken(token))
        break
      }
    }
  }
  if (notice.isModified() || notice.isRemoved()) {
    if (getState().get(DUCK_SESSION).profile.tokens().toArray().includes(notice.token().address())
      || notice.token().symbol() === TIME) {
      // dispatch(watchInitWallet())
    }
  }
  dispatch(notice.isRemoved()
    ? removeToken(notice.token())
    : setToken(notice.token()))
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

export const formTokenLoadMetaData = async (token: TokenModel, dispatch) => {
  dispatch({ type: TOKENS_FORM_FETCH })
  const managerDAO = await contractsManagerDAO.getERC20ManagerDAO()
  const symbolAddress = token.symbol() && await managerDAO.getTokenAddressBySymbol(token.symbol())
  dispatch({ type: TOKENS_FORM_FETCH, end: true })

  if ((symbolAddress !== null && token.address() !== symbolAddress) || (token.symbol() && token.symbol().toUpperCase() === 'ETH')) {
    throw { symbol: I18n.t('settings.erc20.tokens.errors.symbolInUse') }
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
  dispatch(setToken(oldToken.isFetching(true)))
  const dao = await contractsManagerDAO.getERC20ManagerDAO()
  try {
    await dao.modifyToken(oldToken, newToken.totalSupply(new Amount(0, newToken.symbol())))
    dispatch(removeToken(oldToken))
  } catch (e) {
    dispatch(setToken(oldToken.isFetching(false)))
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
  if (!validator.address(token.address())) {
    const dao = new ERC20DAO(token)
    const symbol = await dao.getSymbolFromContract()
    const decimals = await dao.getDecimalsFromContract()

    dispatch(change(FORM_CBE_TOKEN, 'symbol', symbol))
    dispatch(change(FORM_CBE_TOKEN, 'decimals', decimals))

  }
  dispatch({ type: TOKENS_FORM_FETCH, end: true })
}
