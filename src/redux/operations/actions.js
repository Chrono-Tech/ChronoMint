import { Map } from 'immutable'
import { notify } from '../../redux/notifier/notifier'
import ContractsManagerDAO from '../../dao/ContractsManagerDAO'
import LS from '../../utils/LocalStorage'
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

export const watchOperation = (notice: OperationNoticeModel, isOld) => async (dispatch) => {
  dispatch(notify(notice, isOld))
  if (!isOld) {
    dispatch(updateOperation(notice.operation()))

    if (notice.operation().isCancelled()) {
      const tx = notice.operation().tx()
      const dao = await ContractsManagerDAO.getPendingManagerDAO()
      for (let multisigDAO of dao.multisigDAO()) {
        multisigDAO = await multisigDAO
        const {id, isRevoked} = multisigDAO.getFitMultisig(tx)
        dispatch({type: OPERATIONS_CANCEL, tx, id, isRevoked, dao: multisigDAO})
      }
    }
  }
}

export const watchInitOperations = () => async (dispatch) => {
  const userDAO = await ContractsManagerDAO.getUserManagerDAO()
  dispatch({type: OPERATIONS_SIGNS_REQUIRED, required: await userDAO.getSignsRequired()})

  const dao = await ContractsManagerDAO.getPendingManagerDAO()

  const callback = (notice, isOld) => dispatch(watchOperation(notice, isOld))

  return Promise.all([
    dao.watchConfirmation(callback),
    dao.watchRevoke(callback),

    dao.watchDone(operation => dispatch(updateOperation(operation)))
  ])
}

const calcFromBlock = (toBlock) => toBlock - 6000 < 0 ? 0 : toBlock - 6000

export const listOperations = () => async (dispatch) => {
  dispatch(operationsFetch())
  const dao = await ContractsManagerDAO.getPendingManagerDAO()
  return dao.web3.eth.getBlockNumber((e, r) => {
    const toBlock = e ? 0 : r
    const fromBlock = calcFromBlock(toBlock)
    Promise.all([
      dao.getList(),
      dao.getCompletedList(fromBlock, toBlock)
    ]).then(r => {
      dispatch(operationsList(r[0].merge(r[1]), fromBlock))
    })
  })
}

// TODO
// export const getCompletedOperations = (toBlock) => dispatch => {
//   const fromBlock = calcFromBlock(toBlock)
//   dispatch(operationsFetch())
//   return PendingManagerDAO.getCompletedList(fromBlock, toBlock).then(list => {
//     dispatch(operationsList(list, fromBlock))
//   })
// }

export const confirmOperation = (operation: OperationModel) => async (dispatch) => {
  dispatch(updateOperation(operation.fetching()))
  const dao = await ContractsManagerDAO.getPendingManagerDAO()
  return dao.confirm(operation).catch(() => {
    dispatch(updateOperation(operation))
  })
}

export const revokeOperation = (operation: OperationModel) => async (dispatch) => {
  dispatch(updateOperation(operation.fetching()))
  const dao = await ContractsManagerDAO.getPendingManagerDAO()
  return dao.revoke(operation).catch(() => {
    dispatch(updateOperation(operation))
  })
}

export const openOperationsSettings = () => async (dispatch) => {
  const dao = await ContractsManagerDAO.getUserManagerDAO()
  return Promise.all([
    dao.getSignsRequired(),
    dao.getAdminCount()
  ]).then(([required, adminCount]) => {
    dispatch({type: OPERATIONS_SIGNS_REQUIRED, required})
    dispatch({type: OPERATIONS_ADMIN_COUNT, adminCount})
    dispatch(showOperationsSettingsModal())
  })
}

export const setRequiredSignatures = (n: number) => async (dispatch) => {
  const dao = await ContractsManagerDAO.getUserManagerDAO()
  return dao.getSignsRequired().then(signs => {
    if (signs === parseInt(n, 10)) {
      return
    }
    return dao.setRequired(n).then(r => {
      if (!r) {
        dispatch(showAlertModal({title: 'nav.error', message: 'operations.errors.requiredSigns'}))
      }
    })
  })
}
