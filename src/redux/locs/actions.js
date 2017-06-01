import TokenContractsDAO from '../../dao/TokenContractsDAO'
import DAORegistry from '../../dao/DAORegistry'
import LOCModel2 from '../../models/LOCModel2'
import { showAlertModal } from '../ui/modal'

export const LOCS_LIST_FETCH = 'locs/LIST_FETCH'
export const LOCS_LIST = 'locs/LIST'
export const LOCS_UPDATE_FILTER = 'locs/UPDATE_FILTER'

export const LOC_CREATE = 'loc/CREATE'

export const LOC_UPDATE = 'loc/UPDATE'
// export const LOC_TRANSACTION = 'loc/TRANSACTION'
export const LOC_REMOVE = 'loc/REMOVE'
export const LOCS_COUNTER = 'loc/COUNTER'

const handleWatchUpdate = (name) => async (dispatch) => {
  console.log('--watch', name)
  const dao = await DAORegistry.getLOCManagerDAO()
  const loc = await dao.fetchLOC(name)
  dispatch({type: LOC_UPDATE, loc: loc.isPending(false)})
}

export const initLOCwatcher = () => async (dispatch) => {
  const callback = (name: string) => dispatch(handleWatchUpdate(name))
  const dao = await DAORegistry.getLOCManagerDAO()
  dao.watchNewLOC(callback)
  dao.watchUpdateLOC(callback)
  dao.watchError()
}

export const updateLOC = (loc: LOCModel2) => async (dispatch) => {
  dispatch({type: LOC_UPDATE, loc: loc.isPending(true)})
  const dao = await DAORegistry.getLOCManagerDAO()
  return dao.updateLOC(loc)
}

export const addLOC = (loc: LOCModel2) => async (dispatch) => {
  dispatch({type: LOC_CREATE, loc})
  const dao = await DAORegistry.getLOCManagerDAO()
  return dao.addLOC(loc).then(() => {
    return true
  }).catch((e) => {
    dispatch(showAlertModal({title: 'Error', message: e.message}))
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

export const issueLH = (data) => (dispatch) => {
  const {issueAmount, address} = data
  dispatch({type: LOC_UPDATE, data: {valueName: 'isIssuing', value: true, address}})
  return TokenContractsDAO.reissueAsset('LHT', issueAmount, address).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isIssuing', value: false, address}})
  })
}

export const redeemLH = (data) => (dispatch) => {
  const {redeemAmount, address} = data
  dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: true, address}})
  return TokenContractsDAO.revokeAsset('LHT', redeemAmount, address).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: false, address}})
  }).catch(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: false, address}, result: 'error'})
  })
}

// export const handleNewLOC = (locModel) => (dispatch) => {
//   dispatch({type: LOC_CREATE, data: locModel})
// }

// export const handleRemoveLOC = (address) => (dispatch) => {
//   dispatch({type: LOC_REMOVE, data: {address}})
// }

// export const handleUpdateLOCValue = (address, valueName, value) => (dispatch) => {
//   dispatch({type: LOC_UPDATE, data: {valueName, value, address}})
// }

export const getLOCs = () => async (dispatch) => {
  dispatch({type: LOCS_LIST_FETCH})
  const dao = await DAORegistry.getLOCManagerDAO()
  return dao.getLOCs().then(locs => {
    dispatch({type: LOCS_LIST, locs})
  })
}

export const getLOCsCounter = () => async (dispatch) => {
  const dao = await DAORegistry.getLOCManagerDAO()
  return dao.getLOCCount().then(counter => {
    dispatch({type: LOCS_COUNTER, payload: counter})
  })
}

export const updateLOCFilter = (filter) => (dispatch) => {
  dispatch({type: LOCS_UPDATE_FILTER, filter})
}
