import { I18n } from 'react-redux-i18n'
import { change } from 'redux-form'

import contractsManagerDAO from 'dao/ContractsManagerDAO'

import type AbstractFetchingModel from 'models/AbstractFetchingModel'
import type TokenModel from 'models/TokenModel'
import type TokenNoticeModel from 'models/notices/TokenNoticeModel'

import { notify } from 'redux/notifier/actions'
import { watchInitWallet, TIME } from 'redux/mainWallet/actions'

export const TOKENS_LIST = 'settings/TOKENS_LIST'
export const TOKENS_SET = 'settings/TOKENS_SET'
export const TOKENS_REMOVE = 'settings/TOKENS_REMOVE'
export const TOKENS_FORM = 'settings/TOKENS_FORM'
export const TOKENS_FORM_FETCH = 'settings/TOKENS_FORM_FETCH'

const setToken = (token: TokenModel) => ({ type: TOKENS_SET, token })
const removeToken = (token: TokenModel) => ({ type: TOKENS_REMOVE, token })

export const watchToken = (notice: TokenNoticeModel) => async (dispatch, getState) => {
  if (notice.isModified()) {
    for (const token: TokenModel of getState().get('settingsERC20Tokens').list.valueSeq().toArray()) {
      if (token.address() === notice.oldAddress()) {
        dispatch(removeToken(token))
        break
      }
    }
  }
  if (notice.isModified() || notice.isRemoved()) {
    if (getState().get('session').profile.tokens().toArray().includes(notice.token().address())
      || notice.token().symbol() === TIME) {
      dispatch(watchInitWallet())
    }
  }
  dispatch(notice.isRemoved() ?
    removeToken(notice.token()) : setToken(notice.token()))
  if (getState().get('session').isCBE) {
    dispatch(notify(notice))
  }
}

export const watchInitERC20Tokens = () => async dispatch => {
  const callback = notice => dispatch(watchToken(notice))

  const dao = await contractsManagerDAO.getERC20ManagerDAO()

  return Promise.all([
    dao.watchAdd(callback),
    dao.watchModify(callback),
    dao.watchRemove(callback),
  ])
}

export const listTokens = () => async dispatch => {
  const dao = await contractsManagerDAO.getERC20ManagerDAO()
  const list = await dao.getTokens()
  dispatch({ type: TOKENS_LIST, list })
}

export const formTokenLoadMetaData = async (token: TokenModel, dispatch, formName) => {
  dispatch({ type: TOKENS_FORM_FETCH })

  const managerDAO = await contractsManagerDAO.getERC20ManagerDAO()

  let dao
  try {
    dao = await contractsManagerDAO.getERC20DAO(token.address(), true)
  } catch (e) {
    dispatch({ type: TOKENS_FORM_FETCH, end: true })
    throw { address: I18n.t('settings.erc20.tokens.errors.invalidAddress') }
  }

  try {
    if (!token.decimals()) {
      dispatch(change(formName, 'decimals', dao.getDecimals()))
    }
    if (!token.symbol()) {
      dispatch(change(formName, 'symbol', dao.getSymbol()))
      token = token.setSymbol(dao.getSymbol())
    }
  } catch (e) {
    // eslint-disable-next-line
    console.warn('Load meta data error', e)
  }

  const symbolAddress = await managerDAO.getTokenAddressBySymbol(token.symbol())

  dispatch({ type: TOKENS_FORM_FETCH, end: true })

  if ((symbolAddress !== null && token.address() !== symbolAddress) || token.symbol().toUpperCase() === 'ETH') {
    throw { symbol: I18n.t('settings.erc20.tokens.errors.symbolInUse') }
  }
}

export const addToken = (token: TokenModel | AbstractFetchingModel) => async dispatch => {
  dispatch(setToken(token.isFetching(true)))
  const dao = await contractsManagerDAO.getERC20ManagerDAO()
  try {
    await dao.addToken(token)
  } catch (e) {
    dispatch(removeToken(token))
  }
}

export const modifyToken = (oldToken: TokenModel | AbstractFetchingModel, newToken: TokenModel) => async dispatch => {
  dispatch(setToken(oldToken.isFetching(true)))
  const dao = await contractsManagerDAO.getERC20ManagerDAO()
  try {
    await dao.modifyToken(oldToken, newToken)
    dispatch(removeToken(oldToken))
  } catch (e) {
    dispatch(setToken(oldToken.isFetching(false)))
  }
}

export const revokeToken = (token: TokenModel | AbstractFetchingModel) => async dispatch => {
  dispatch(setToken(token.isFetching(true)))
  const dao = await contractsManagerDAO.getERC20ManagerDAO()
  try {
    await dao.removeToken(token)
  } catch (e) {
    dispatch(setToken(token.isFetching(false)))
  }
}
