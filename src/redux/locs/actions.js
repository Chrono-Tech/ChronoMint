import ContractsManagerDAO from '../../dao/ContractsManagerDAO'
import LOCModel from '../../models/LOCModel'
import LOCNoticeModel from '../../models/notices/LOCNoticeModel'
import { notify } from '../notifier/actions'
import LOCManagerDAO from '../../dao/LOCManagerDAO'
import { TX_FRONTEND_ERROR_CODES } from '../../dao/AbstractContractDAO'

export const LOCS_LIST_FETCH = 'locs/LIST_FETCH'
export const LOCS_LIST = 'locs/LIST'
export const LOCS_UPDATE_FILTER = 'locs/UPDATE_FILTER'
export const LOCS_COUNTER = 'locs/COUNTER'

export const LOC_CREATE = 'loc/CREATE'
export const LOC_UPDATE = 'loc/UPDATE'
export const LOC_REMOVE = 'loc/REMOVE'

const handleLOCUpdate = (loc: LOCModel, notice: LOCNoticeModel) => (dispatch) => {
  dispatch({type: LOC_REMOVE, name: loc.oldName()})
  dispatch({type: LOC_UPDATE, loc})
  dispatch(notify(notice))
}

const handleLOCRemove = (name: string, notice: LOCNoticeModel) => (dispatch) => {
  dispatch({type: LOC_REMOVE, name})
  dispatch(notify(notice))
}

const handleError = (e, loc) => (dispatch) => {
  if (e.code === TX_FRONTEND_ERROR_CODES.FRONTEND_CANCELLED) {
    dispatch({type: LOC_UPDATE, loc: loc.isPending(false)})
  } else {
    dispatch({type: LOC_UPDATE, loc: loc.isFailed(true)})
  }
}

export const watchInitLOC = () => async (dispatch) => {
  const updateCallback = (loc, notice) => dispatch(handleLOCUpdate(loc, notice))
  const removeCallback = (name, notice) => dispatch(handleLOCRemove(name, notice))

  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  await locManagerDAO.watchNewLOC(updateCallback)
  await locManagerDAO.watchUpdateLOC(updateCallback)
  await locManagerDAO.watchUpdateLOCStatus(updateCallback)
  await locManagerDAO.watchRemoveLOC(removeCallback)
  await locManagerDAO.watchReissue(updateCallback)
  await locManagerDAO.watchRevoke(updateCallback)
}

export const getLOCs = () => async (dispatch) => {
  dispatch({type: LOCS_LIST_FETCH})
  const locManagerDAO: LOCManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  const locs = await locManagerDAO.getLOCs()
  dispatch({type: LOCS_LIST, locs})
}

export const addLOC = (loc: LOCModel) => async (dispatch) => {
  dispatch({type: LOC_CREATE, loc})
  try {
    const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.addLOC(loc)
  } catch (e) {
    dispatch({type: LOC_REMOVE, name: loc.name()})
  }
}

export const updateLOC = (loc: LOCModel) => async (dispatch) => {
  dispatch({type: LOC_REMOVE, name: loc.oldName()})
  dispatch({type: LOC_UPDATE, loc: loc.isPending(true)})

  try {
    const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.updateLOC(loc)
  } catch (e) {
    dispatch(handleError(e, loc))
  }
}

export const removeLOC = (loc: LOCModel) => async (dispatch) => {
  dispatch({type: LOC_UPDATE, loc: loc.isPending(true)})
  try {
    const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.removeLOC(loc.name())
  } catch (e) {
    dispatch(handleError(e, loc))
  }
}

export const issueAsset = (amount: number, loc: LOCModel) => async (dispatch) => {
  dispatch({type: LOC_UPDATE, loc: loc.isPending(true)})
  try {
    const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.issueAsset(amount, loc.name())
  } catch (e) {
    dispatch(handleError(e, loc))
  }
}

export const updateStatus = (status: number, loc: LOCModel) => async (dispatch) => {
  dispatch({type: LOC_UPDATE, loc: loc.isPending(true)})
  try {
    const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.updateStatus(status, loc.name())
  } catch (e) {
    dispatch(handleError(e, loc))
  }
}

export const revokeAsset = (amount: number, loc: LOCModel) => async (dispatch) => {
  dispatch({type: LOC_UPDATE, loc: loc.isPending(true)})
  try {
    const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.revokeAsset(amount, loc.name())
  } catch (e) {
    dispatch(handleError(e, loc))
  }
}

export const getLOCsCounter = () => async (dispatch) => {
  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  const counter = await locManagerDAO.getLOCCount()
  dispatch({type: LOCS_COUNTER, counter})
}

export const updateLOCFilter = (filter) => (dispatch) => {
  dispatch({type: LOCS_UPDATE_FILTER, filter})
}
