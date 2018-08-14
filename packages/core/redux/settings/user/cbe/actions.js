/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { change } from 'redux-form/immutable'
import { CBE_LIST, CBE_LOADING } from './constants'
import { daoByType } from '../../../daos/selectors'

export const listCBE = () => async (dispatch, getState) => {
  const dao = daoByType('UserManager')(getState())
  const list = await dao.getCBEList()
  dispatch({ type: CBE_LIST, list })
}

export const formCBELoadName = (account, formName) => async (dispatch, getState) => {
  dispatch({ type: CBE_LOADING, isLoading: true })
  const dao = daoByType('UserManager')(getState())
  const profile = await dao.getMemberProfile(account)
  dispatch({ type: CBE_LOADING, isLoading: false })
  dispatch(change(formName, 'name', profile.name()))
}
