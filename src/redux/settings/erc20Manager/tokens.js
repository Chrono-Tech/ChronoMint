import Immutable from 'immutable'
import { change } from 'redux-form'
import ContractsManagerDAO from '../../../dao/ContractsManagerDAO'
import TokenModel from '../../../models/TokenModel'
import { showSettingsTokenModal } from '../../ui/modal'
import { FORM_SETTINGS_TOKEN } from '../../../components/pages/SettingsPage/ERC20ManagerPage/TokenForm'

export const TOKENS_LIST = 'settings/TOKENS_LIST'
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
    default:
      return state
  }
}

export const listTokens = () => async (dispatch) => {
  const dao = await ContractsManagerDAO.getERC20ManagerDAO()
  const list = await dao.getTokens(false, false)
  dispatch({type: TOKENS_LIST, list})
}

export const formToken = (token: TokenModel) => dispatch => {
  dispatch({type: TOKENS_FORM, token})
  dispatch(showSettingsTokenModal())
}

export const formTokenLoadMetaData = (address) => async (dispatch) => {
  dispatch({type: TOKENS_FORM_FETCH})

  let dao
  try {
    dao = await ContractsManagerDAO.getERC20DAO(address, true)
    // TODO Check for ERC20 interface validity
  } catch (e) {
    // TODO Show error "Can't resolve valid ERC20 contract from this address"
    console.error('Can\'t resolve valid ERC20 contract from this address')
    dispatch({type: TOKENS_FORM_FETCH, end: true})
    return
  }

  dispatch(change(FORM_SETTINGS_TOKEN, 'decimals', dao.getDecimals()))
  try {
    dispatch(change(FORM_SETTINGS_TOKEN, 'symbol', dao.getSymbol()))
    dispatch(change(FORM_SETTINGS_TOKEN, 'name', dao.getName()))
  } catch (e) {}
  dispatch({type: TOKENS_FORM_FETCH, end: true})
}

export const saveToken = (token: TokenModel) => async (dispatch) => {
  // TODO fetching
  const dao = await ContractsManagerDAO.getERC20ManagerDAO()
  try {
    dao.saveToken(token)
    // TODO stop fetching
  } catch (e) {
    // TODO stop fetching
  }
}
