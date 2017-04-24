import LOCsManagerDAO from '../../../dao/LOCsManagerDAO'
import { showAlertModal } from '../../ui/modal'
import { LOC_FORM_STORE, LOC_FORM_SUBMIT_START, LOC_FORM_SUBMIT_END } from './reducer'
import { LOC_UPDATE } from '../list/reducer'
import {transactionStart} from '../../notifier/notifier'

const storeLOCAction = payload => ({type: LOC_FORM_STORE, payload})
const submitLOCStartAction = () => ({type: LOC_FORM_SUBMIT_START})
const submitLOCEndAction = () => ({type: LOC_FORM_SUBMIT_END})

const updateLOC = (loc, account) => (dispatch) => {
  const address = loc.getAddress()
  dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: true, address}})
  return LOCsManagerDAO.updateLOC(loc._map.toJS(), account).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
  }).catch(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
    return false
  })
}

const proposeLOC = (loc, account) => (dispatch) => {
  dispatch(submitLOCStartAction())
  return LOCsManagerDAO.proposeLOC(loc, account).then(() => {
    dispatch(showAlertModal({title: 'New LOC', message: loc.name() + ': Request sent successfully'}))
    dispatch(submitLOCEndAction())
    return true
  }).catch(() => {
    dispatch(submitLOCEndAction())
    return false
  })
}

const submitLOC = (loc, account) => (dispatch) => {
  dispatch(transactionStart())
  if (!loc.getAddress()) {
    return dispatch(proposeLOC(loc, account))
  } else {
    return dispatch(updateLOC(loc, account))
  }
}

const removeLOC = (address, account) => (dispatch) => {
  dispatch(transactionStart())
  dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: true, address}})
  return LOCsManagerDAO.removeLOC(address, account).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
    dispatch(showAlertModal({title: 'Remove LOC', message: 'Request sent successfully'}))
  }).catch(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
    dispatch(showAlertModal({title: 'Remove LOC Error!', message: 'Transaction canceled!'}))
  })
}

export {
  storeLOCAction,
  submitLOC,
  removeLOC
}
