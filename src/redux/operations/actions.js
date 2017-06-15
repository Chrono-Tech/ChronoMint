import { Map } from 'immutable'
import { notify } from '../../redux/notifier/notifier'
import ContractsManagerDAO from '../../dao/ContractsManagerDAO'
import LS from '../../utils/LocalStorage'
import OperationModel from '../../models/OperationModel'
import OperationNoticeModel from '../../models/notices/OperationNoticeModel'
import { showAlertModal, showOperationsSettingsModal } from '../ui/modal'
import web3Provider from '../../network/Web3Provider'

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

  const [memberId, required] = await Promise.all([
    userDAO.getMemberId(LS.getAccount()),
    userDAO.getSignsRequired()
  ])

  const dao = await ContractsManagerDAO.getPendingManagerDAO()
  dao.setMemberId(memberId)

  dispatch({type: OPERATIONS_SIGNS_REQUIRED, required})

  const callback = (notice, isOld) => dispatch(watchOperation(notice, isOld))

  return Promise.all([
    dao.watchConfirmation(callback),
    dao.watchRevoke(callback),

    dao.watchDone(operation => dispatch(updateOperation(operation)))
  ])
}

const calcFromBlock = (toBlock) => Math.max(toBlock - 6000, 0)

export const listOperations = () => async (dispatch) => {
  dispatch(operationsFetch())
  const [dao, block] = await Promise.all([
    ContractsManagerDAO.getPendingManagerDAO(),
    web3Provider.getBlockNumber()
  ])

  const toBlock = block || 0
  const fromBlock = calcFromBlock(toBlock)
  const [list, completedList] = await Promise.all([
    dao.getList(),
    dao.getCompletedList(fromBlock, toBlock)
  ])
  dispatch(operationsList(list.merge(completedList), fromBlock))
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
