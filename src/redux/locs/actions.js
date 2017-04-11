import {SubmissionError} from 'redux-form'
import TokenContractsDAO from '../../dao/TokenContractsDAO'
import LOCsManagerDAO from '../../dao/LOCsManagerDAO'
import {LOCS_FETCH_START, LOCS_FETCH_END} from './communication'
import { LOCS_LIST, LOC_CREATE, LOC_UPDATE, LOC_REMOVE } from './reducer'
import { LOCS_COUNTER } from './counter'
import { showAlertModal, hideModal } from '../ui/modal'

const updateLOC = (data) => (dispatch) => {
  return LOCsManagerDAO.updateLOC(data, data.account).then((r) => {
    if (r === true) {
      dispatch(hideModal())
    } else {
      dispatch(showAlertModal({title: 'Error', message: 'LOC not updated'}))
    }
  })
}

const issueLH = (data) => (dispatch) => {
  const {account, issueAmount, address} = data
  return TokenContractsDAO.reissueAsset('LHT', issueAmount, account, address).then(() => {
    dispatch(hideModal())
  })
}

const redeemLH = (data) => (dispatch) => {
  const {account, redeemAmount, address} = data
  return TokenContractsDAO.revokeAsset('LHT', redeemAmount, address, account).then(() => {
    dispatch(hideModal())
  })
}

const proposeLOC = (props) => (dispatch) => {
  let {locName, website, issueLimit, publishedHash, expDate, account} = props
  return LOCsManagerDAO.proposeLOC(locName, website, issueLimit, publishedHash, expDate, account).then(r => {
    if (!r) {
      dispatch(showAlertModal({title: 'Error', message: locName + ' Not proposed'}))
    } else {
      dispatch(hideModal())
    }
    return r
  })
}

const submitLOC = (data, hideModal) => (dispatch) => {
  if (!data.address) {
    return dispatch(proposeLOC(data))
  } else {
    return dispatch(updateLOC(data))
  }
}

const removeLOC = (address, account) => (dispatch) => {
  return LOCsManagerDAO.removeLOC(address, account).then(r => {
    if (!r) {
      dispatch(showAlertModal({title: 'Error', message: 'LOC not removed.'}))
    }
    dispatch(hideModal())
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
  const {account, sendAmount} = data
  return TokenContractsDAO.getLhtBalance().then((r) => {
    if (sendAmount > r) {
      throw new SubmissionError({sendAmount: 'Insufficient funds. Must be not greater then ' + r, _error: 'Error'})
    }
    return TokenContractsDAO.sendLHTToExchange(sendAmount, account).then((r) => {
      if (r) {
        dispatch(hideModal())
      } else {
        throw new SubmissionError({sendAmount: 'Insufficient funds.', _error: 'Error'})
      }
    })
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
