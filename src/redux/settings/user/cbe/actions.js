import { change } from 'redux-form'
import type AbstractFetchingModel from 'models/AbstractFetchingModel'
import type CBEModel from 'models/CBEModel'
import type CBENoticeModel from 'models/notices/CBENoticeModel'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { showSettingsCBEModal } from 'redux/ui/modal'
import { notify } from 'redux/notifier/actions'
import { FORM_SETTINGS_CBE } from 'components/pages/SettingsPage/UserManagerPage/CBEAddressForm'

export const CBE_LIST_FETCH = 'settings/CBE_LIST_FETCH'
export const CBE_LIST = 'settings/CBE_LIST'
export const CBE_FORM = 'settings/CBE_FORM'
export const CBE_SET = 'settings/CBE_SET'
export const CBE_REMOVE = 'settings/CBE_REMOVE'

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
  dispatch(change(FORM_SETTINGS_CBE, 'name', 'loading...')) // TODO @bshevchenko: i18n
  const dao = await contractsManagerDAO.getUserManagerDAO()
  const profile = await dao.getMemberProfile(account)
  dispatch(change(FORM_SETTINGS_CBE, 'name', profile.name()))
}

export const addCBE = (cbe: CBEModel | AbstractFetchingModel) => async (dispatch) => {
  dispatch(setCBE(cbe.fetching()))
  const dao = await contractsManagerDAO.getUserManagerDAO()
  try {
    await dao.addCBE(cbe)
  } catch (e) {
    dispatch(removeCBE(cbe))
  }
}

export const revokeCBE = (cbe: CBEModel | AbstractFetchingModel) => async (dispatch) => {
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
