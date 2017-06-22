import Immutable from 'immutable'
import { change } from 'redux-form'

import CBEModel from '../../../models/CBEModel'
import CBENoticeModel from '../../../models/notices/CBENoticeModel'

import contractsManagerDAO from '../../../dao/ContractsManagerDAO'
import ls from '../../../utils/LocalStorage'

import { showSettingsCBEModal } from '../../ui/modal'
import { notify } from '../../notifier/notifier'
import { loadUserProfile } from '../../session/actions'

import { FORM_SETTINGS_CBE } from '../../../components/pages/SettingsPage/UserManagerPage/CBEAddressForm'


export const CBE_LIST_FETCH = 'settings/CBE_LIST_FETCH'
export const CBE_LIST = 'settings/CBE_LIST'
export const CBE_FORM = 'settings/CBE_FORM'
export const CBE_REMOVE_TOGGLE = 'settings/CBE_REMOVE_TOGGLE'
export const CBE_UPDATE = 'settings/CBE_UPDATE' // for add purposes as well
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
    case CBE_UPDATE:
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
export const updateCBE = (cbe: CBEModel) => ({type: CBE_UPDATE, cbe})
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

export const saveCBE = (cbe: CBEModel, add: boolean) => async (dispatch) => {
  dispatch(updateCBE(cbe.fetching()))
  const dao = await contractsManagerDAO.getUserManagerDAO()
  try {
    const r = await dao.saveCBE(cbe)
    if (r instanceof CBEModel) {
      dispatch(updateCBE(cbe))
      if (ls.getAccount() === r.address()) {
        dispatch(loadUserProfile(r.user()))
      }
    }
  } catch (e) {
    dispatch(add ? removeCBE(cbe) : updateCBE(cbe))
  }
}

export const revokeCBE = (cbe: CBEModel) => async (dispatch) => {
  dispatch(removeCBEToggle(null))
  dispatch(updateCBE(cbe.fetching()))
  const dao = await contractsManagerDAO.getUserManagerDAO()
  try {
    await dao.revokeCBE(cbe)
  } catch (e) {
    dispatch(updateCBE(cbe))
  }
}

export const watchCBE = (notice: CBENoticeModel, isOld) => dispatch => {
  dispatch(notify(notice, isOld))
  if (!isOld) {
    dispatch(notice.isRevoked() ? removeCBE(notice.cbe()) : updateCBE(notice.cbe()))
  }
}

export const watchInitCBE = () => async (dispatch) => {
  const dao = await contractsManagerDAO.getUserManagerDAO()
  return dao.watchCBE((notice, isOld) => dispatch(watchCBE(notice, isOld)))
}
