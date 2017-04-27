import { Map } from 'immutable'
import UserDAO from '../../dao/UserDAO'
import CBEModel from '../../models/CBEModel'
import { showSettingsCBEModal } from '../ui/modal'
import { notify, transactionStart } from '../notifier/notifier'
import { loadUserProfile } from '../session/actions'
import { change } from 'redux-form'
import CBENoticeModel from '../../models/notices/CBENoticeModel'
import { FORM_SETTINGS_CBE } from '../../components/forms/settings/CBEAddressForm'
import ls from '../../utils/localStorage'
import localStorageKeys from '../../constants/localStorageKeys'

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
  isReady: false,
  isFetching: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CBE_LIST:
      return {
        ...state,
        list: action.list,
        isFetching: false,
        isReady: true
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

const removeCBEToggle = (cbe: CBEModel = null) => ({type: CBE_REMOVE_TOGGLE, cbe})
const updateCBE = (cbe: CBEModel) => ({type: CBE_UPDATE, cbe})
const removeCBE = (cbe: CBEModel) => ({type: CBE_REMOVE, cbe})

const listCBE = () => dispatch => {
  dispatch({type: CBE_LIST_FETCH})
  return UserDAO.getCBEList().then(list => {
    dispatch({type: CBE_LIST, list})
  })
}

const formCBE = (cbe: CBEModel) => dispatch => {
  dispatch({type: CBE_FORM, cbe})
  dispatch(showSettingsCBEModal())
}

const formCBELoadName = (account) => dispatch => {
  dispatch(change(FORM_SETTINGS_CBE, 'name', 'loading...'))
  return UserDAO.getMemberProfile(account).then(profile => {
    dispatch(change(FORM_SETTINGS_CBE, 'name', profile.name()))
  }).catch(e => console.error(e))
}

const treatCBE = (cbe: CBEModel, add: boolean, account) => dispatch => {
  dispatch(transactionStart())
  dispatch(updateCBE(cbe.fetching()))
  return UserDAO.treatCBE(cbe, account).then(r => {
    if (r instanceof CBEModel && ls(localStorageKeys.ACCOUNT) === r.address()) {
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

const revokeCBE = (cbe: CBEModel, account) => dispatch => {
  dispatch(removeCBEToggle(null))
  dispatch(transactionStart())
  dispatch(updateCBE(cbe.fetching()))
  return UserDAO.revokeCBE(cbe, account).catch(() => {
    dispatch(updateCBE(cbe))
  })
}

const watchCBE = (notice: CBENoticeModel, isOld) => dispatch => {
  dispatch(notify(notice, isOld))
  if (!isOld) {
    dispatch(notice.isRevoked() ? removeCBE(notice.cbe()) : updateCBE(notice.cbe()))
  }
}

const watchInitCBE = account => dispatch => {
  UserDAO.watchCBE((notice, isOld) => dispatch(watchCBE(notice, isOld)))
}

export {
  listCBE,
  formCBE,
  formCBELoadName,
  treatCBE,
  removeCBEToggle,
  revokeCBE,
  watchCBE,
  watchInitCBE,
  updateCBE,
  removeCBE
}

export default reducer
