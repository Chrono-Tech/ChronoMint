/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import contractsManagerDAO from '../../dao/ContractsManagerDAO'
import type LOCManagerDAO from '../../dao/LOCManagerDAO'
import { TX_FRONTEND_ERROR_CODES } from '../../dao/constants'
import LOCModel from '../../models/LOCModel'
import LOCNoticeModel from '../../models/notices/LOCNoticeModel'
import type TokenModel from '../../models/tokens/TokenModel'
import { notify } from '../notifier/actions'
import Amount from '../../models/Amount'
import {
  LOC_CREATE,
  LOC_REMOVE,
  LOC_UPDATE,
  LOCS_LIST_FETCH,
  LOCS_LIST,
  LOCS_UPDATE_FILTER,
} from './constants'

const handleLOCUpdate = (loc: LOCModel, notice: LOCNoticeModel) => (dispatch) => {
  dispatch({ type: LOC_REMOVE, name: loc.oldName() })
  dispatch({ type: LOC_UPDATE, loc })
  dispatch(notify(notice))
}

const handleLOCRemove = (name: string, notice: LOCNoticeModel) => (dispatch) => {
  dispatch({ type: LOC_REMOVE, name })
  dispatch(notify(notice))
}

const handleError = (e, loc) => (dispatch) => {
  if (e.code === TX_FRONTEND_ERROR_CODES.FRONTEND_CANCELLED) {
    dispatch({ type: LOC_UPDATE, loc: loc.isPending(false) })
  } else {
    dispatch({ type: LOC_UPDATE, loc: loc.isFailed(true) })
  }
}

export const watchInitLOC = () => async (dispatch) => {
  const updateCallback = (loc, notice) => dispatch(handleLOCUpdate(loc, notice))
  const removeCallback = (name, notice) => dispatch(handleLOCRemove(name, notice))

  const locManagerDAO = await contractsManagerDAO.getLOCManagerDAO()
  await locManagerDAO.watchNewLOC(updateCallback)
  await locManagerDAO.watchUpdateLOC(updateCallback)
  await locManagerDAO.watchUpdateLOCStatus(updateCallback)
  await locManagerDAO.watchRemoveLOC(removeCallback)
  await locManagerDAO.watchReissue(updateCallback)
  await locManagerDAO.watchRevoke(updateCallback)
}

export const getLOCs = () => async (dispatch) => {
  dispatch({ type: LOCS_LIST_FETCH })
  const locManagerDAO: LOCManagerDAO = await contractsManagerDAO.getLOCManagerDAO()
  const locs = await locManagerDAO.getLOCs()
  dispatch({ type: LOCS_LIST, locs })
}

export const addLOC = (loc: LOCModel) => async (dispatch) => {
  dispatch({ type: LOC_CREATE, loc })
  try {
    const locManagerDAO = await contractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.addLOC(loc)
  } catch (e) {
    // eslint-disable-next-line
    console.warn(e.message)
    dispatch({ type: LOC_REMOVE, name: loc.name() })
  }
}

export const updateLOC = (loc: LOCModel) => async (dispatch) => {
  dispatch({ type: LOC_REMOVE, name: loc.oldName() })
  dispatch({ type: LOC_UPDATE, loc: loc.isPending(true) })

  try {
    const locManagerDAO = await contractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.updateLOC(loc)
  } catch (e) {
    // eslint-disable-next-line
    console.warn(e.message)
    dispatch(handleError(e, loc))
  }
}

export const removeLOC = (loc: LOCModel) => async (dispatch) => {
  dispatch({ type: LOC_UPDATE, loc: loc.isPending(true) })
  try {
    const locManagerDAO = await contractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.removeLOC(loc)
  } catch (e) {
    // eslint-disable-next-line
    console.warn(e.message)
    dispatch(handleError(e, loc))
  }
}

export const issueAsset = (amount: Amount, loc: LOCModel) => async (dispatch) => {
  dispatch({ type: LOC_UPDATE, loc: loc.isPending(true) })
  try {
    const locManagerDAO = await contractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.issueAsset(amount, loc)
  } catch (e) {
    // eslint-disable-next-line
    console.warn(e.message)
    dispatch(handleError(e, loc))
  }
}

export const sendAsset = (token: TokenModel, to: string, amount: Amount) => async () => {
  try {
    const locManagerDAO = await contractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.sendAsset(token, to, amount)
  } catch (e) {
    // eslint-disable-next-line
    console.warn(e.message)
    // no rollback
  }
}

export const updateStatus = (status: number, loc: LOCModel) => async (dispatch) => {
  dispatch({ type: LOC_UPDATE, loc: loc.isPending(true) })
  try {
    const locManagerDAO = await contractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.updateStatus(status, loc)
  } catch (e) {
    // eslint-disable-next-line
    console.warn(e.message)
    dispatch(handleError(e, loc))
  }
}

export const revokeAsset = (amount: Amount, loc: LOCModel) => async (dispatch) => {
  dispatch({ type: LOC_UPDATE, loc: loc.isPending(true) })
  try {
    const locManagerDAO = await contractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.revokeAsset(amount, loc)
  } catch (e) {
    // eslint-disable-next-line
    console.warn(e.message)
    dispatch(handleError(e, loc))
  }
}

export const updateLOCFilter = (filter) => (dispatch) => {
  dispatch({ type: LOCS_UPDATE_FILTER, filter })
}
