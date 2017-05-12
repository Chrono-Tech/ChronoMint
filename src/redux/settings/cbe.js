import { Map } from 'immutable'
import UserDAO from '../../dao/UserDAO'
import CBEModel from '../../models/CBEModel'
import { showSettingsCBEModal } from '../ui/modal'
import { notify } from '../notifier/notifier'
import { loadUserProfile } from '../session/actions'
import { change } from 'redux-form'
import CBENoticeModel from '../../models/notices/CBENoticeModel'
import { FORM_SETTINGS_CBE } from '../../components/forms/settings/CBEAddressForm'
import LS from '../../dao/LocalStorageDAO'

export const CBE_LIST_FETCH = 'settings/CBE_LIST_FETCH'
export const CBE_LIST = 'settings/CBE_LIST'
export const CBE_FORM = 'settings/CBE_FORM'
export const CBE_REMOVE_TOGGLE = 'settings/CBE_REMOVE_TOGGLE'
export const CBE_UPDATE = 'settings/CBE_UPDATE' // for add purposes as well
export const CBE_REMOVE = 'settings/CBE_REMOVE'

const initialState = {
  list: new Map(),
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
        list: action.cbe
          ? state.list.set(action.cbe.address(), action.cbe)
          : state.list.set(state.selected.address(), state.selected)
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
    default:
      return state
  }
}

export const removeCBEToggle = (cbe: CBEModel = null) => ({type: CBE_REMOVE_TOGGLE, cbe})
export const updateCBE = (cbe: CBEModel) => ({type: CBE_UPDATE, cbe})
export const removeCBE = (cbe: CBEModel) => ({type: CBE_REMOVE, cbe})

export const listCBE = () => dispatch => {
  dispatch({type: CBE_LIST_FETCH})
  return UserDAO.getCBEList().then(list => {
    dispatch({type: CBE_LIST, list})
  })
}

export const formCBE = (cbe: CBEModel) => dispatch => {
  dispatch({type: CBE_FORM, cbe})
  dispatch(showSettingsCBEModal())
}

export const formCBELoadName = (account) => dispatch => {
  dispatch(change(FORM_SETTINGS_CBE, 'name', 'loading...'))
  return UserDAO.getMemberProfile(account).then(profile => {
    dispatch(change(FORM_SETTINGS_CBE, 'name', profile.name()))
  }).catch(e => console.error(e))
}

export const treatCBE = (cbe: CBEModel, add: boolean) => dispatch => {
  dispatch(updateCBE(cbe.fetching()))
  return UserDAO.treatCBE(cbe).then(r => {
    if (r instanceof CBEModel && LS.getAccount() === r.address()) {
      dispatch(loadUserProfile(r.user()))
    }
  }).catch(() => {
    if (add) {
      dispatch(removeCBE(cbe))
    } else {
      dispatch(updateCBE(null))
    }
  })
}

export const revokeCBE = (cbe: CBEModel) => dispatch => {
  dispatch(removeCBEToggle(null))
  dispatch(updateCBE(cbe.fetching()))
  return UserDAO.revokeCBE(cbe).catch(() => {
    dispatch(updateCBE(cbe))
  })
}

export const watchCBE = (notice: CBENoticeModel, isOld) => dispatch => {
  dispatch(notify(notice, isOld))
  if (!isOld) {
    dispatch(notice.isRevoked() ? removeCBE(notice.cbe()) : updateCBE(notice.cbe()))
  }
}

export const watchInitCBE = () => dispatch => {
  UserDAO.watchCBE((notice, isOld) => dispatch(watchCBE(notice, isOld)))
}
