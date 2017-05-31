import TokenContractsDAO from '../../../dao/TokenContractsDAO'
import DAORegistry from '../../../dao/DAORegistry'
import { LOCS_COUNTER } from '../counter'
import LOCModel2 from '../../../models/LOCModel2'

export const LOCS_LIST = 'loc/CREATE_ALL'
export const LOC_CREATE = 'loc/CREATE'
export const LOC_UPDATE = 'loc/UPDATE'
export const LOC_TRANSACTION = 'loc/TRANSACTION'
export const LOC_PENDING = 'loc/PENDING'
export const LOC_REMOVE = 'loc/REMOVE'
export const LOCS_FETCH_START = 'locs/FETCH_START'
export const LOCS_UPDATE_FILTER = 'locs/UPDATE_FILTER'

export const initLOCwatcher = () => async (dispatch) => {
  const callback = (loc: LOCModel2) => dispatch({type: LOC_TRANSACTION, loc})

  const dao = await DAORegistry.getLOCManagerDAO()
  dao.watchLOCs(callback)
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

export const handleNewLOC = (locModel) => (dispatch) => {
  dispatch({type: LOC_CREATE, data: locModel})
}

export const handleRemoveLOC = (address) => (dispatch) => {
  dispatch({type: LOC_REMOVE, data: {address}})
}

export const handleUpdateLOCValue = (address, valueName, value) => (dispatch) => {
  dispatch({type: LOC_UPDATE, data: {valueName, value, address}})
}

export const getLOCs = () => async (dispatch) => {
  dispatch({type: LOCS_FETCH_START})
  const dao = await DAORegistry.getLOCManagerDAO()
  return dao.getLOCs().then(locs => {
    dispatch({type: LOCS_LIST, data: locs})
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
