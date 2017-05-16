import { Map } from 'immutable'
import { notify } from '../../redux/notifier/notifier'
import OperationsDAO from '../../dao/OperationsDAO'
import UserDAO from '../../dao/UserDAO'
import LS from '../../dao/LocalStorageDAO'
import OperationModel from '../../models/OperationModel'
import OperationNoticeModel from '../../models/notices/OperationNoticeModel'
import { showAlertModal, showOperationsSettingsModal } from '../ui/modal'

export const OPERATIONS_FETCH = 'operations/FETCH'
export const OPERATIONS_LIST = 'operations/LIST'
export const OPERATIONS_UPDATE = 'operations/UPDATE'
export const OPERATIONS_SIGNS_REQUIRED = 'operations/SIGNS_REQUIRED'
export const OPERATIONS_ADMIN_COUNT = 'operations/ADMIN_COUNT'
export const OPERATIONS_CANCEL = 'operations/CANCEL'

const updateOperation = (operation: OperationModel) => ({type: OPERATIONS_UPDATE, operation})
const operationsFetch = () => ({type: OPERATIONS_FETCH})
const operationsList = (list: Map, fromBlock) => ({type: OPERATIONS_LIST, list, fromBlock})

export const watchOperation = (notice: OperationNoticeModel, isOld) => dispatch => {
  dispatch(notify(notice, isOld))
  if (!isOld) {
    dispatch(updateOperation(notice.operation()))

    if (notice.operation().isCancelled()) {
      dispatch({type: OPERATIONS_CANCEL, tx: notice.operation().tx()})
    }
  }
}

export const watchInitOperation = () => dispatch => {
  return Promise.all([
    UserDAO.getMemberId(LS.getAccount()),
    UserDAO.getSignsRequired()
  ]).then(([memberId, required]) => {
    OperationsDAO.setMemberId(memberId)

    dispatch({type: OPERATIONS_SIGNS_REQUIRED, required})

    const callback = (notice, isOld) => dispatch(watchOperation(notice, isOld))
    OperationsDAO.watchConfirmation(callback)
    OperationsDAO.watchRevoke(callback)

    OperationsDAO.watchDone(operation => dispatch(updateOperation(operation)))

    OperationsDAO.watchError(msg => dispatch(showAlertModal({title: 'nav.error', message: 'operations.errors.' + msg})))
  })
}

const calcFromBlock = (toBlock) => toBlock - 200 < 0 ? 0 : toBlock - 200

export const listOperations = () => dispatch => {
  dispatch(operationsFetch())
  return OperationsDAO.web3.eth.getBlockNumber((e, r) => {
    const toBlock = e ? 0 : r
    const fromBlock = calcFromBlock(toBlock)
    Promise.all([
      OperationsDAO.getList(),
      OperationsDAO.getCompletedList(fromBlock, toBlock)
    ]).then(r => {
      dispatch(operationsList(r[0].merge(r[1]), fromBlock))
    })
  })
}

export const getCompletedOperations = (toBlock) => dispatch => {
  const fromBlock = calcFromBlock(toBlock)
  dispatch(operationsFetch())
  return OperationsDAO.getCompletedList(fromBlock, toBlock).then(list => {
    dispatch(operationsList(list, fromBlock))
  })
}

export const confirmOperation = (operation: OperationModel) => dispatch => {
  dispatch(updateOperation(operation.fetching()))
  return OperationsDAO.confirm(operation).catch(() => {
    dispatch(updateOperation(operation))
  })
}

export const revokeOperation = (operation: OperationModel) => dispatch => {
  dispatch(updateOperation(operation.fetching()))
  return OperationsDAO.revoke(operation).catch(() => {
    dispatch(updateOperation(operation))
  })
}

export const openOperationsSettings = () => dispatch => {
  return Promise.all([
    UserDAO.getSignsRequired(),
    UserDAO.getAdminCount()
  ]).then(([required, adminCount]) => {
    dispatch({type: OPERATIONS_SIGNS_REQUIRED, required})
    dispatch({type: OPERATIONS_ADMIN_COUNT, adminCount})
    dispatch(showOperationsSettingsModal())
  })
}

export const setRequiredSignatures = (n: number) => dispatch => {
  return UserDAO.getSignsRequired().then(signs => {
    if (signs === parseInt(n, 10)) {
      return
    }
    return UserDAO.setRequired(n).then(r => {
      if (!r) {
        dispatch(showAlertModal({title: 'nav.error', message: 'operations.errors.requiredSigns'}))
      }
    })
  })
}
