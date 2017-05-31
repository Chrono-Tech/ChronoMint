import DAORegistry from '../../../dao/DAORegistry'
import { showAlertModal } from '../../ui/modal'
import { LOC_UPDATE, LOC_PENDING } from '../list/actions'
import LOCModel2 from '../../../models/LOCModel2'

export const LOC_FORM_STORE = 'locForm/STORE'
export const LOC_FORM_SUBMIT_START = 'locForm/SUBMIT_START'
export const LOC_FORM_SUBMIT_END = 'locForm/SUBMIT_END'

export const storeLOCAction = payload => ({type: LOC_FORM_STORE, payload})
const submitLOCEndAction = () => ({type: LOC_FORM_SUBMIT_END})

export const updateLOC = (loc: LOCModel2) => async (dispatch) => {
  dispatch({type: LOC_PENDING, loc, isPending: true})
  const dao = await DAORegistry.getLOCManagerDAO()
  return dao.updateLOC(loc).then(() => {
    dispatch({type: LOC_PENDING, loc, isPending: false})
  })
}

export const addLOC = (loc: LOCModel2) => async (dispatch) => {
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
