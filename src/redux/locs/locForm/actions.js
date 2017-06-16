import ContractsManagerDAO from '../../../dao/ContractsManagerDAO'
import { showAlertModal } from '../../ui/modal'
import { LOC_FORM_STORE, LOC_FORM_SUBMIT_START, LOC_FORM_SUBMIT_END } from './reducer'
import { LOC_UPDATE } from '../list/reducer'

const storeLOCAction = payload => ({type: LOC_FORM_STORE, payload})
const submitLOCStartAction = () => ({type: LOC_FORM_SUBMIT_START})
const submitLOCEndAction = () => ({type: LOC_FORM_SUBMIT_END})

const updateLOC = (loc) => async (dispatch) => {
  const address = loc.getAddress()
  dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: true, address}})
  const dao = await ContractsManagerDAO.getLOCManagerDAO()
  return dao.updateLOC(loc._map.toJS()).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
  }).catch(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
    return false
  })
}

const proposeLOC = (loc) => async (dispatch) => {
  dispatch(submitLOCStartAction())
  const dao = await ContractsManagerDAO.getLOCManagerDAO()
  return dao.proposeLOC(loc).then(() => {
    dispatch(showAlertModal({title: 'New LOC', message: loc.name() + ': Request sent successfully'}))
    dispatch(submitLOCEndAction())
    return true
  }).catch(() => {
    dispatch(submitLOCEndAction())
    return false
  })
}

const submitLOC = (loc) => (dispatch) => {
  if (!loc.getAddress()) {
    return dispatch(proposeLOC(loc))
  } else {
    return dispatch(updateLOC(loc))
  }
}

const removeLOC = (address) => async (dispatch) => {
  dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: true, address}})
  const dao = await ContractsManagerDAO.getLOCManagerDAO()
  return dao.removeLOC(address).then(() => {
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
