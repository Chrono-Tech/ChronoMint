import Immutable from 'immutable'
import { I18n } from 'react-redux-i18n'
import { change } from 'redux-form'
import ContractsManagerDAO from '../../../dao/ContractsManagerDAO'
import TokenModel from '../../../models/TokenModel'
import { showSettingsTokenModal } from '../../ui/modal'
import { FORM_SETTINGS_TOKEN } from '../../../components/pages/SettingsPage/ERC20ManagerPage/TokenForm'

export const TOKENS_LIST = 'settings/TOKENS_LIST'
export const TOKENS_UPDATE = 'settings/TOKENS_UPDATE'
export const TOKENS_REMOVE = 'settings/TOKENS_REMOVE'
export const TOKENS_FORM = 'settings/TOKENS_FORM'
export const TOKENS_FORM_FETCH = 'settings/TOKENS_FORM_FETCH'

const initialState = {
  list: new Immutable.Map(),
  selected: new TokenModel(),
  formFetching: false,
  isFetched: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TOKENS_LIST:
      return {
        ...state,
        list: action.list,
        isFetched: true
      }
    case TOKENS_FORM:
      return {
        ...state,
        selected: action.token
      }
    case TOKENS_FORM_FETCH:
      return {
        ...state,
        formFetching: !(action.hasOwnProperty('end') && action.end)
      }
    case TOKENS_UPDATE:
      return {
        ...state,
        list: state.list.set(action.token.id(), action.token)
      }
    case TOKENS_REMOVE:
      return {
        ...state,
        list: state.list.delete(action.token.id())
      }
    default:
      return state
  }
}

export const setToken = (token: TokenModel) => ({type: TOKENS_UPDATE, token})
export const removeToken = (token: TokenModel) => ({type: TOKENS_REMOVE, token})

export const listTokens = () => async (dispatch) => {
  const dao = await ContractsManagerDAO.getERC20ManagerDAO()
  const list = await dao.getTokens()
  dispatch({type: TOKENS_LIST, list})
}

export const formToken = (token: TokenModel) => dispatch => {
  dispatch({type: TOKENS_FORM, token})
  dispatch(showSettingsTokenModal())
}

export const formTokenLoadMetaData = async (token: TokenModel, dispatch) => {
  dispatch({type: TOKENS_FORM_FETCH})
  let dao
  try {
    dao = await ContractsManagerDAO.getERC20DAO(token.address(), true)
  } catch (e) {
    dispatch({type: TOKENS_FORM_FETCH, end: true})
    throw {address: I18n.t('settings.erc20.tokens.errors.invalidAddress')}
  }

  try {
    if (token.decimals() === '') {
      dispatch(change(FORM_SETTINGS_TOKEN, 'decimals', dao.getDecimals()))
    }
    if (token.symbol() === '') {
      dispatch(change(FORM_SETTINGS_TOKEN, 'symbol', dao.getSymbol()))
      token = token.set('symbol', dao.getSymbol())
    }
  } catch (e) {
    console.error('Load meta data error', e)
  }

  const managerDAO = await ContractsManagerDAO.getERC20ManagerDAO()
  const symbolAddress = await managerDAO.getTokenAddressBySymbol(token.symbol())

  dispatch({type: TOKENS_FORM_FETCH, end: true})

  // TODO @ipavlenko: check a list of existent tokens, not only ETH
  if (symbolAddress !== null || token.symbol().toUpperCase() === 'ETH') {
    throw {symbol: I18n.t('settings.erc20.tokens.errors.symbolInUse')}
  }
}

export const addToken = (token: TokenModel) => async (dispatch) => {
  dispatch(setToken(token.fetching()))
  const dao = await ContractsManagerDAO.getERC20ManagerDAO()
  try {
    await dao.addToken(token)
    dispatch(setToken(token.notFetching()))
  } catch (e) {
    dispatch(removeToken(token))
  }
}

export const modifyToken = (oldToken: TokenModel, newToken: TokenModel) => async (dispatch) => {
  dispatch(setToken(oldToken.fetching()))
  const dao = await ContractsManagerDAO.getERC20ManagerDAO()
  try {
    await dao.modifyToken(oldToken, newToken)
    dispatch(removeToken(oldToken))
    dispatch(setToken(newToken))
  } catch (e) {
    dispatch(setToken(oldToken.notFetching()))
  }
}

export const revokeToken = (token: TokenModel) => async (dispatch) => {
  dispatch(setToken(token.fetching()))
  const dao = await ContractsManagerDAO.getERC20ManagerDAO()
  try {
    await dao.removeToken(token)
    dispatch(removeToken(token))
  } catch (e) {
    dispatch(setToken(token.notFetching()))
  }
}
