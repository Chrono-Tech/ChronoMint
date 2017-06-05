import TokenContractsDAO from '../../dao/TokenContractsDAO'
import ContractsManagerDAO from '../../dao/ContractsManagerDAO'
import LOCModel from '../../models/LOCModel'
import { showAlertModal } from '../ui/modal'
import LOCNoticeModel from '../../models/notices/LOCNoticeModel'
import { notify } from '../notifier/notifier'
import LOCManagerDAO from '../../dao/LOCManagerDAO'

export const LOCS_LIST_FETCH = 'locs/LIST_FETCH'
export const LOCS_LIST = 'locs/LIST'
export const LOCS_UPDATE_FILTER = 'locs/UPDATE_FILTER'
export const LOCS_COUNTER = 'locs/COUNTER'

export const LOC_CREATE = 'loc/CREATE'
export const LOC_UPDATE = 'loc/UPDATE'
export const LOC_REMOVE = 'loc/REMOVE'

const removeOldLOC = (loc) => (dispatch) => {
  if (loc.name() !== loc.oldName()) {
    dispatch({type: LOC_REMOVE, name: loc.oldName()})
  }
}

const handleLOCUpdate = (loc: LOCModel, notice: LOCNoticeModel, isOld: boolean) => (dispatch) => {
  dispatch(removeOldLOC(loc))
  dispatch({type: LOC_UPDATE, loc})
  dispatch(notify(notice, isOld))
}

const handleLOCRemove = (name: string, notice: LOCNoticeModel, isOld: boolean) => (dispatch) => {
  dispatch({type: LOC_REMOVE, name})
  dispatch(notify(notice, isOld))
}

export const watchInitLOC = () => async (dispatch) => {
  const updateCallback = (loc, notify, isOld) => dispatch(handleLOCUpdate(loc, notify, isOld))
  const removeCallback = (name, notify, isOld) => dispatch(handleLOCRemove(name, notify, isOld))

  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  locManagerDAO.watchNewLOC(updateCallback)
  locManagerDAO.watchUpdateLOC(updateCallback)
  locManagerDAO.watchRemoveLOC(removeCallback)
}

export const getLOCs = () => async (dispatch) => {
  dispatch({type: LOCS_LIST_FETCH})
  const locManagerDAO: LOCManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  const locs = await locManagerDAO.getLOCs()
  dispatch({type: LOCS_LIST, locs})
}

export const addLOC = (loc: LOCModel) => async (dispatch) => {
  dispatch({type: LOC_CREATE, loc})
  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  return locManagerDAO.addLOC(loc).then(() => {
    return true
  }).catch((e) => {
    dispatch(showAlertModal({title: 'Error', message: e.message}))
    return false
  })
}

export const updateLOC = (loc: LOCModel) => async (dispatch) => {
  dispatch(removeOldLOC(loc))
  dispatch({type: LOC_UPDATE, loc: loc.isPending(true)})
  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  return locManagerDAO.updateLOC(loc)
}

export const removeLOC = (loc: LOCModel) => async (dispatch) => {
  dispatch({type: LOC_UPDATE, loc: loc.isPending(true)})
  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  return locManagerDAO.removeLOC(loc)
}

// TODO @dkchv: !!!
export const issueLH = (data) => (dispatch) => {
  const {issueAmount, address} = data
  dispatch({type: LOC_UPDATE, data: {valueName: 'isIssuing', value: true, address}})
  return TokenContractsDAO.reissueAsset('LHT', issueAmount, address).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isIssuing', value: false, address}})
  })
}

// TODO @dkchv: !!!!
export const redeemLH = (data) => (dispatch) => {
  const {redeemAmount, address} = data
  dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: true, address}})
  return TokenContractsDAO.revokeAsset('LHT', redeemAmount, address).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: false, address}})
  }).catch(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: false, address}, result: 'error'})
  })
}

export const getLOCsCounter = () => async (dispatch) => {
  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  return locManagerDAO.getLOCCount().then(counter => {
    dispatch({type: LOCS_COUNTER, payload: counter})
  })
}

export const updateLOCFilter = (filter) => (dispatch) => {
  dispatch({type: LOCS_UPDATE_FILTER, filter})
}
