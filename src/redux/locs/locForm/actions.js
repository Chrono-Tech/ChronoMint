import DAORegistry from '../../../dao/DAORegistry'
import { showAlertModal } from '../../ui/modal'
import { LOC_FORM_STORE, LOC_FORM_SUBMIT_START, LOC_FORM_SUBMIT_END } from './reducer'
import { LOC_UPDATE } from '../list/actions'

export const storeLOCAction = payload => ({type: LOC_FORM_STORE, payload})
const submitLOCEndAction = () => ({type: LOC_FORM_SUBMIT_END})

const updateLOC = (loc) => async (dispatch) => {
  const address = loc.getAddress()
  dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: true, address}})
  const dao = await DAORegistry.getLOCManagerDAO()
  return dao.updateLOC(loc._map.toJS()).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
  }).catch(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
    return false
  })
}

export const addLOC = (loc) => async (dispatch) => {
  dispatch({type: LOC_FORM_SUBMIT_START})
  const dao = await DAORegistry.getLOCManagerDAO()
  return dao.addLOC(loc).then(() => {
    dispatch(showAlertModal({title: 'New LOC', message: loc.name() + ': Request sent successfully'}))
    dispatch(submitLOCEndAction())
    return true
  }).catch(() => {
    dispatch(submitLOCEndAction())
    return false
  })
}

export const submitLOC = (loc) => (dispatch) => {
  if (!loc.getAddress()) {
    return dispatch(addLOC(loc))
  } else {
    return dispatch(updateLOC(loc))
  }
}

export const removeLOC = (address) => async (dispatch) => {
  dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: true, address}})
  const dao = await DAORegistry.getLOCManagerDAO()
  return dao.removeLOC(address).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
    dispatch(showAlertModal({title: 'Remove LOC', message: 'Request sent successfully'}))
  }).catch(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
    dispatch(showAlertModal({title: 'Remove LOC Error!', message: 'Transaction canceled!'}))
  })
}
