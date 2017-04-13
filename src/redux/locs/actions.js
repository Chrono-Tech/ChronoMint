import {SubmissionError} from 'redux-form'
import TokenContractsDAO from '../../dao/TokenContractsDAO'
import LOCsManagerDAO from '../../dao/LOCsManagerDAO'
import { LOCS_FETCH_START, LOCS_FETCH_END } from './communication'
import { LOCS_LIST, LOC_CREATE, LOC_UPDATE, LOC_REMOVE } from './reducer'
import { showAlertModal } from '../ui/modal'
import { LOC_FORM_SUBMIT_START, LOC_FORM_SUBMIT_END } from './loc'
import { LOCS_COUNTER } from './counter'
import { sendCMLHTToExchangeStart, sendCMLHTToExchangeEnd } from '../wallet/reducer'
import { updateContractsManagerLHTBalance } from '../wallet/wallet'

const submitLOCStartAction = () => ({type: LOC_FORM_SUBMIT_START})
const submitLOCEndAction = () => ({type: LOC_FORM_SUBMIT_END})

const updateLOC = (data) => (dispatch) => {
  dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: true, address: data.address}})
  return LOCsManagerDAO.updateLOC(data, data.account).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address: data.address}})
    dispatch(showAlertModal({title: 'Update LOC', message: 'Request sent successfully'}))
  })
}

const issueLH = (data) => (dispatch) => {
  const {account, issueAmount, address} = data
  dispatch({type: LOC_UPDATE, data: {valueName: 'isIssuing', value: true, address}})
  return TokenContractsDAO.reissueAsset('LHT', issueAmount, account, address).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isIssuing', value: false, address}})
    dispatch(showAlertModal({title: 'Issue LH', message: 'Request sent successfully'}))
  })
}

const redeemLH = (data) => (dispatch) => {
  const {account, redeemAmount, address} = data
  dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: true, address}})
  return TokenContractsDAO.revokeAsset('LHT', redeemAmount, address, account).then(() => {
    dispatch({type: LOC_UPDATE, data: {valueName: 'isRedeeming', value: false, address}})
    dispatch(showAlertModal({title: 'Redeem LH', message: 'Request sent successfully'}))
  })
}

const proposeLOC = (props) => (dispatch) => {
  dispatch(submitLOCStartAction())
  let {locName, website, issueLimit, publishedHash, expDate, account} = props
  return LOCsManagerDAO.proposeLOC(locName, website, issueLimit, publishedHash, expDate, account).then(() => {
    dispatch(showAlertModal({title: 'New LOC', message: locName + ': Request sent successfully'}))
    dispatch(submitLOCEndAction())
    return true
  })
}

const submitLOC = (data) => (dispatch) => {
  if (!data.address) {
    return dispatch(proposeLOC(data))
  } else {
    return dispatch(updateLOC(data))
  }
}

const removeLOC = (address, account) => (dispatch) => {
  dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: true, address}})
  return LOCsManagerDAO.removeLOC(address, account).then(r => {
    if (!r) {
      dispatch(showAlertModal({title: 'Error', message: 'LOC not removed.'}))
    } else {
      dispatch(showAlertModal({title: 'Remove LOC', message: 'Request sent successfully'}))
    }
    dispatch({type: LOC_UPDATE, data: {valueName: 'isSubmitting', value: false, address}})
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

const sendLHToExchange = (data) => (dispatch) => {
  dispatch(sendCMLHTToExchangeStart())
  const {account, sendAmount} = data
  return TokenContractsDAO.sendLHTToExchange(sendAmount, account).then((r) => {
    dispatch(sendCMLHTToExchangeEnd())
    dispatch(updateContractsManagerLHTBalance())
    if (r) {
      dispatch(showAlertModal({title: 'Send LHT to Exchange', message: 'Request sent successfully'}))
    } else {
      throw new SubmissionError({sendAmount: 'Insufficient funds.', _error: 'Error'})
    }
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
