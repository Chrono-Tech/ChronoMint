import TokenContractsDAO from '../../../dao/TokenContractsDAO'
import DAORegistry from '../../../dao/DAORegistry'
import { LOCS_FETCH_START, LOCS_FETCH_END } from '../commonProps/index'
import { LOCS_LIST, LOC_CREATE, LOC_UPDATE, LOC_REMOVE } from './reducer'
import { LOCS_COUNTER } from '../counter'

const issueLH = (data) => (dispatch) => {
  const {issueAmount, address} = data
  dispatch({type: LOC_UPDATE, data: {valueName: 'isIssuing', value: true, address}})
  return TokenContractsDAO.reissueAsset('LHT', issueAmount, address).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isIssuing', value: false, address}})
  })
}

const redeemLH = (data) => (dispatch) => {
  const {redeemAmount, address} = data
  dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: true, address}})
  return TokenContractsDAO.revokeAsset('LHT', redeemAmount, address).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: false, address}})
  }).catch(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: false, address}, result: 'error'})
  })
}

const handleNewLOC = (locModel) => (dispatch) => {
  dispatch({type: LOC_CREATE, data: locModel})
}

const handleRemoveLOC = (address) => (dispatch) => {
  dispatch({type: LOC_REMOVE, data: {address}})
}

const handleUpdateLOCValue = (address, valueName, value) => (dispatch) => {
  dispatch({type: LOC_UPDATE, data: {valueName, value, address}})
}

const getLOCs = () => async (dispatch) => {
  dispatch({type: LOCS_FETCH_START})
  const dao = await DAORegistry.getLOCManagerDAO()
  return dao.getLOCs().then(locs => {
    dispatch({type: LOCS_LIST, data: locs})
    dispatch({type: LOCS_FETCH_END})
  })
}

const getLOCsCounter = () => async (dispatch) => {
  const dao = await DAORegistry.getLOCManagerDAO()
  return dao.getLOCCount().then(counter => {
    dispatch({type: LOCS_COUNTER, payload: counter})
  })
}

export {
  issueLH,
  redeemLH,
  handleNewLOC,
  handleRemoveLOC,
  handleUpdateLOCValue,
  getLOCs,
  getLOCsCounter
}
