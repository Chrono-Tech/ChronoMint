import Immutable from 'immutable'
import { change } from 'redux-form'

import CBEModel from '../../../models/CBEModel'
import CBENoticeModel from '../../../models/notices/CBENoticeModel'

import contractsManagerDAO from '../../../dao/ContractsManagerDAO'

import { showSettingsCBEModal } from '../../ui/modal'
import { notify } from '../../notifier/notifier'

import { FORM_SETTINGS_CBE } from '../../../components/pages/SettingsPage/UserManagerPage/CBEAddressForm'


export const CBE_LIST_FETCH = 'settings/CBE_LIST_FETCH'
export const CBE_LIST = 'settings/CBE_LIST'
export const CBE_FORM = 'settings/CBE_FORM'
export const CBE_REMOVE_TOGGLE = 'settings/CBE_REMOVE_TOGGLE'
export const CBE_SET = 'settings/CBE_SET'
export const CBE_REMOVE = 'settings/CBE_REMOVE'

const initialState = {
  list: new Immutable.Map(),
  selected: new CBEModel(),
  isRemove: false,
  isFetched: false,
  isFetching: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CBE_LIST:
      return {
        ...state,
        list: action.list,
        isFetching: false,
        isFetched: true
      }
    case CBE_FORM:
      return {
        ...state,
        selected: action.cbe
      }
    case CBE_REMOVE_TOGGLE:
      return {
        ...state,
        selected: action.cbe === null ? new CBEModel() : action.cbe,
        isRemove: action.cbe !== null
      }
    case CBE_SET:
      return {
        ...state,
        list: state.list.set(action.cbe.address(), action.cbe)
      }
    case CBE_REMOVE:
      return {
        ...state,
        list: state.list.delete(action.cbe.address())
      }
    case CBE_LIST_FETCH:
      return {
        ...state,
        isFetching: true
      }
      return state
    default:
      return state
  }
}

export const removeCBEToggle = (cbe: CBEModel = null) => ({type: CBE_REMOVE_TOGGLE, cbe})
export const setCBE = (cbe: CBEModel) => ({type: CBE_SET, cbe})
export const removeCBE = (cbe: CBEModel) => ({type: CBE_REMOVE, cbe})

export const listCBE = () => async (dispatch) => {
  dispatch({type: CBE_LIST_FETCH})
  const dao = await contractsManagerDAO.getUserManagerDAO()
  const list = await dao.getCBEList()
  dispatch({type: CBE_LIST, list})
}

export const formCBE = (cbe: CBEModel) => dispatch => {
  dispatch({type: CBE_FORM, cbe})
  dispatch(showSettingsCBEModal())
}

export const formCBELoadName = (account) => async (dispatch) => {
  dispatch(change(FORM_SETTINGS_CBE, 'name', 'loading...'))
  const dao = await contractsManagerDAO.getUserManagerDAO()
  const profile = await dao.getMemberProfile(account)
  dispatch(change(FORM_SETTINGS_CBE, 'name', profile.name()))
}

export const addCBE = (cbe: CBEModel) => async (dispatch) => {
  dispatch(setCBE(cbe.fetching()))
  const dao = await contractsManagerDAO.getUserManagerDAO()
  try {
    await dao.addCBE(cbe)
  } catch (e) {
    dispatch(removeCBE(cbe))
  }
}

export const revokeCBE = (cbe: CBEModel) => async (dispatch) => {
  dispatch(removeCBEToggle(null))
  dispatch(setCBE(cbe.fetching()))
  const dao = await contractsManagerDAO.getUserManagerDAO()
  try {
    await dao.revokeCBE(cbe)
  } catch (e) {
    dispatch(setCBE(cbe))
  }
}

export const watchCBE = (notice: CBENoticeModel) => dispatch => {
  dispatch(notify(notice))
  dispatch(notice.isRevoked() ? removeCBE(notice.cbe()) : setCBE(notice.cbe()))
}

export const watchInitCBE = () => async (dispatch) => {
  const dao = await contractsManagerDAO.getUserManagerDAO()
  return dao.watchCBE((notice) => dispatch(watchCBE(notice)))
}
