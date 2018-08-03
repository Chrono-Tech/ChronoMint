/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import contractsManagerDAO from '../../dao/ContractsManagerDAO'
import type AbstractFetchingModel from '../../models/AbstractFetchingModel'
import OperationModel from '../../models/OperationModel'
import OperationNoticeModel from '../../models/notices/OperationNoticeModel'
import { notify } from '../notifier/actions'
import {
  OPERATIONS_ADMIN_COUNT,
  OPERATIONS_FETCH,
  OPERATIONS_LIST,
  OPERATIONS_SET,
  OPERATIONS_SIGNS_REQUIRED,
} from './constants'

const setOperation = (operation: OperationModel) => ({ type: OPERATIONS_SET, operation })
const operationsFetch = () => ({ type: OPERATIONS_FETCH })
const operationsList = (list: Immutable.Map) => ({ type: OPERATIONS_LIST, list })

export const watchOperation = (notice: OperationNoticeModel) => async (dispatch) => {
  dispatch(notify(notice))
  dispatch(setOperation(notice.operation()))
}

export const watchInitOperations = () => async (dispatch) => {
  const userDAO = await contractsManagerDAO.getUserManagerDAO()
  dispatch({ type: OPERATIONS_SIGNS_REQUIRED, required: await userDAO.getSignsRequired() })

  const dao = await contractsManagerDAO.getPendingManagerDAO()

  const callback = (notice) => dispatch(watchOperation(notice))

  return Promise.all([
    dao.watchConfirmation(callback),
    dao.watchRevoke(callback),

    dao.watchDone((operation) => dispatch(setOperation(operation))),
  ])
}

export const listOperations = () => async (dispatch) => {
  dispatch(operationsFetch())
  const dao = await contractsManagerDAO.getPendingManagerDAO()
  const [ list, completedList ] = await Promise.all([
    dao.getList(),
    dao.getCompletedList(),
  ])
  dispatch(operationsList(list.merge(completedList)))
}

export const loadMoreCompletedOperations = () => async (dispatch) => {
  dispatch(operationsFetch())
  const dao = await contractsManagerDAO.getPendingManagerDAO()
  const list = await dao.getCompletedList()
  dispatch(operationsList(list))
}

export const confirmOperation = (operation: OperationModel | AbstractFetchingModel) => async (dispatch) => {
  dispatch(setOperation(operation.isFetching(true)))
  const dao = await contractsManagerDAO.getPendingManagerDAO()
  try {
    await dao.confirm(operation)
  } catch (e) {
    dispatch(setOperation(operation))
  }
}

export const revokeOperation = (operation: OperationModel | AbstractFetchingModel) => async dispatch => {
  dispatch(setOperation(operation.isFetching(true)))
  const dao = await contractsManagerDAO.getPendingManagerDAO()
  try {
    await dao.revoke(operation)
  } catch (e) {
    dispatch(setOperation(operation))
  }
}

export const setupOperationsSettings = () => async (dispatch) => {
  const dao = await contractsManagerDAO.getUserManagerDAO()
  const [ required, adminCount ] = await Promise.all([
    dao.getSignsRequired(),
    dao.getAdminCount(),
  ])
  dispatch({ type: OPERATIONS_SIGNS_REQUIRED, required })
  dispatch({ type: OPERATIONS_ADMIN_COUNT, adminCount })
}

// TODO @bshevchenko: dispatch fetching actions
// noinspection JSUnusedLocalSymbols
export const setRequiredSignatures = (n: number) => async () => {
  const dao = await contractsManagerDAO.getUserManagerDAO()
  const currentSigns = await dao.getSignsRequired()
  if (currentSigns === n) {
    return
  }
  try {
    await dao.setRequired(n)
  } catch (e) {
    // TODO @bshevchenko: dispatch rollback actions
  }
}
