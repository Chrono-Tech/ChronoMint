import TokenContractsDAO from '../../../dao/TokenContractsDAO'
import LOCsManagerDAO from '../../../dao/LOCsManagerDAO'
import { LOCS_FETCH_START, LOCS_FETCH_END } from '../commonProps/index'
import { LOCS_LIST, LOC_CREATE, LOC_UPDATE, LOC_REMOVE } from './reducer'
import { LOCS_COUNTER } from '../counter'
import { showAlertModal } from '../../ui/modal'
import {transactionStart} from '../../notifier/notifier'

const issueLH = (data) => (dispatch) => {
  dispatch(transactionStart())
  const {account, issueAmount, address} = data
  dispatch({type: LOC_UPDATE, data: {valueName: 'isIssuing', value: true, address}})
  return TokenContractsDAO.reissueAsset('LHT', issueAmount, account, address).then((r) => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isIssuing', value: false, address}})
    if (r) {
      dispatch(showAlertModal({title: 'Issue LH', message: 'Request sent successfully'}))
    } else {
      dispatch(showAlertModal({title: 'Issue LH Error!', message: 'Transaction canceled!'}))
    }
  })
}

const redeemLH = (data) => (dispatch) => {
  dispatch(transactionStart())
  const {account, redeemAmount, address} = data
  dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: true, address}})
  return TokenContractsDAO.revokeAsset('LHT', redeemAmount, address, account).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: false, address}})
    dispatch(showAlertModal({title: 'Redeem LH', message: 'Request sent successfully'}))
  }).catch(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: false, address}})
    dispatch(showAlertModal({title: 'Redeem LH Error!', message: 'Transaction canceled!'}))
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

const getLOCs = (account) => (dispatch) => {
  dispatch({type: LOCS_FETCH_START})
  return LOCsManagerDAO.getLOCs(account).then(locs => {
    dispatch({type: LOCS_LIST, data: locs})
    dispatch({type: LOCS_FETCH_END})
  })
}

const getLOCsCounter = (account) => (dispatch) => {
  return LOCsManagerDAO.getLOCCount(account).then(counter => {
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
