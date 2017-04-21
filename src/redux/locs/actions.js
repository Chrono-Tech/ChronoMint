import TokenContractsDAO from '../../dao/TokenContractsDAO'
import LOCsManagerDAO from '../../dao/LOCsManagerDAO'
import { LOCS_FETCH_START, LOCS_FETCH_END } from './communication'
import { LOCS_LIST, LOC_CREATE, LOC_UPDATE, LOC_REMOVE } from './reducer'
import { hideModal, showAlertModal } from '../ui/modal'
import { LOC_FORM_SUBMIT_START, LOC_FORM_SUBMIT_END } from './loc'
import { LOCS_COUNTER } from './counter'
import { updateCMLHTBalance, WALLET_SEND_CM_LHT_TO_EXCHANGE_FETCH, WALLET_SEND_CM_LHT_TO_EXCHANGE_END } from '../wallet/actions'
import { transactionStart } from '../notifier/notifier'

const submitLOCStartAction = () => ({type: LOC_FORM_SUBMIT_START})
const submitLOCEndAction = () => ({type: LOC_FORM_SUBMIT_END})

const updateLOC = (loc, account) => (dispatch) => {
  const address = loc.getAddress()
  dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: true, address}})
  return LOCsManagerDAO.updateLOC(loc._map.toJS(), account).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
  }).catch(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
  })
}

const issueLH = (data) => (dispatch) => {
  dispatch(transactionStart())
  const {account, issueAmount, address} = data
  dispatch({type: LOC_UPDATE, data: {valueName: 'isIssuing', value: true, address}})
  return TokenContractsDAO.reissueAsset('LHT', issueAmount, account, address).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isIssuing', value: false, address}})
  })
}

const redeemLH = (data) => (dispatch) => {
  dispatch(transactionStart())
  const {account, redeemAmount, address} = data
  dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: true, address}})
  return TokenContractsDAO.revokeAsset('LHT', redeemAmount, address, account).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: false, address}})
  }).catch(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: false, address}})
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
  return LOCsManagerDAO.removeLOC(address, account).then(r => {
    if (!r) {
      dispatch(showAlertModal({title: 'Remove LOC Error!', message: 'LOC not removed.'}))
    } else {
      dispatch(showAlertModal({title: 'Remove LOC', message: 'Request sent successfully'}))
    }
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
  }).catch(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
    dispatch(showAlertModal({title: 'Remove LOC Error!', message: 'Transaction canceled!'}))
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
  dispatch(hideModal())
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

const sendLHToExchange = (data) => (dispatch) => {
  dispatch(transactionStart())
  dispatch(hideModal())
  dispatch({type: WALLET_SEND_CM_LHT_TO_EXCHANGE_FETCH})
  const {account, sendAmount} = data
  return TokenContractsDAO.sendLHTToExchange(sendAmount, account).then((r) => {
    dispatch({type: WALLET_SEND_CM_LHT_TO_EXCHANGE_END})
    dispatch(updateCMLHTBalance())
    if (r) {
      dispatch(showAlertModal({title: 'Send LHT to Exchange', message: 'Transaction successfully accepted!'}))
    } else {
      dispatch(showAlertModal({title: 'ERROR Send LHT to Exchange', message: 'Insufficient funds.'}))
    }
  }).catch(() => {
    dispatch({type: WALLET_SEND_CM_LHT_TO_EXCHANGE_END})
  })
}

export {
  submitLOC,
  issueLH,
  redeemLH,
  removeLOC,
  handleNewLOC,
  handleRemoveLOC,
  handleUpdateLOCValue,
  getLOCs,
  getLOCsCounter,
  sendLHToExchange
}
