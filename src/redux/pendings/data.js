import {push} from 'react-router-redux'
import PendingManagerDAO from '../../dao/PendingManagerDAO'
import UserDAO from '../../dao/UserDAO'
import {createPendingAction, updatePendingAction, removePendingAction} from './reducer'
import {notify} from '../notifier/notifier'
import PendingOperationNoticeModel from '../../models/notices/PendingOperationNoticeModel'
import {pendingsLoadStartAction, pendingsLoadSuccessAction} from './communication'
import {handleCompletedConfirmation} from '../completedOperations/data'
import {showAlertModal} from '../ui/modal'

const pendingOperationsLimit = 1

const calculateTargetObjName = (operationAddress) => (dispatch, getState) => {
  const operationModel = getState().get('pendings').get(operationAddress)
  const targetAddress = operationModel.targetAddress()
  if (operationModel.functionName() === 'addKey') {
    return UserDAO.getMemberProfile(targetAddress).then(r => r.name() ? r.name() : targetAddress)
  }

  return Promise.resolve(targetAddress)
}
const updateNewPending = (operation) => (dispatch) => {
  const callBack = (valueName, value) => {
    dispatch(updatePendingAction({valueName, value, operation}))
  }
  const promises = []
  promises.push(PendingManagerDAO.getTxsType(operation).then(type => callBack('type', type)))
  promises.push(PendingManagerDAO.getTxsData(operation).then(data => callBack('data', data)))
  return Promise.all(promises)
    .then(() => dispatch(calculateTargetObjName(operation)))
    .then(objName => callBack('targetObjName', objName))
}

const updateExistingPending = (operation, account) => (dispatch) => {
  const callBack = (valueName, value) => {
    dispatch(updatePendingAction({valueName, value, operation}))
  }
  return PendingManagerDAO.hasConfirmed(operation, account).then(hasConfirmed => callBack('hasConfirmed', hasConfirmed))
}

const checkPendingsLimit = (totalCount, notConfirmedCount, pathname) => (dispatch, getState) => {
  const state = getState()
  const pathname = state.get('routing').get('locationBeforeTransitions').get('pathname')
  const pendings = state.get('pendings')
  const notConfirmedCount = pendings.reduce((count, item) => {
    return count + (item.hasConfirmed() ? 0 : 1)
  }, 0)

  if (pendings.size < pendingOperationsLimit) {
    return
  }
  if (notConfirmedCount === 0) {
    return
  }
  if (pathname === '/cbe/operations') {
    return
  }

  dispatch(showAlertModal({title: 'Pending operations limit exceeded', message: 'Please move to pending operations view.'}))
  dispatch(push('/cbe/operations'))
}

const handlePending = (operation, account) => (dispatch) => {
  const callBack = (needed) => (dispatch, getState) => {
    if (!needed) {   //  confirmed
      const operationObj = getState().get('pendings').get(operation)
      dispatch(removePendingAction({operation}))
      return Promise.resolve(operationObj)
    }
    const promises = []
    if (!getState().get('pendings').get(operation)) {
      dispatch(createPendingAction({operation}))
      promises.push(dispatch(updateNewPending(operation)))
    }
    dispatch(updatePendingAction({valueName: 'needed', value: needed, operation}))
    promises.push(dispatch(updateExistingPending(operation, account)))
    return Promise.all(promises).then(() => {
      dispatch(checkPendingsLimit())
      return Promise.resolve(getState().get('pendings').get(operation))
    })
  }

  return PendingManagerDAO.pendingYetNeeded(operation).then(needed => dispatch(callBack(needed)))
}

const getPendings = (account) => (dispatch) => {
  dispatch(pendingsLoadStartAction())
  const promises = []
  PendingManagerDAO.pendingsCount().then(count => {
    for (let i = 0; i < count; i++) {
      let promise = PendingManagerDAO.pendingById(i).then(operation => dispatch(handlePending(operation, account)))
      promises.push(promise)
    }
    Promise.all(promises).then(() => dispatch(pendingsLoadSuccessAction()))
  })
}

const revoke = (data, account) => {
  PendingManagerDAO.revoke(data['operation'], account)
}

const confirm = (data, account) => {
  PendingManagerDAO.confirm(data['operation'], account)
}

const handlePendingConfirmation = (operation, account) => (dispatch) => {
  dispatch(handleCompletedConfirmation(operation))
  dispatch(handlePending(operation, account)).then((pending) => {
    if (pending) {
      dispatch(notify(new PendingOperationNoticeModel({pending})))
    }
  })
}

const handleRevokeOperation = (operation, account) => (dispatch) => {
  dispatch(handlePending(operation, account)).then((pending) => {
    dispatch(notify(new PendingOperationNoticeModel({pending, revoke: true})))
  }
  )
}

export {
  revoke,
  confirm,
  getPendings,
  checkPendingsLimit,
  handlePendingConfirmation,
  handleRevokeOperation
}
