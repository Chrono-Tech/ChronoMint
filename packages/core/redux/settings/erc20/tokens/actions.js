/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import type AbstractFetchingModel from '../../../../models/AbstractFetchingModel'
import type TokenNoticeModel from '../../../../models/notices/TokenNoticeModel'
import type TokenModel from '../../../../models/tokens/TokenModel'
import { notify } from '../../../notifier/actions'
import { DUCK_SESSION } from '../../../session/constants'
import { TOKENS_FETCHED, TOKENS_REMOVE, TOKENS_UPDATE } from '../../../tokens/constants'
import tokenService from '../../../../services/TokenService'
import Amount from '../../../../models/Amount'
import { daoByType } from '../../../daos/selectors'

import { ETH } from '../../../../dao/constants'
import { TOKENS_FORM_FETCH } from './constants'

const setToken = (token: TokenModel) => ({ type: TOKENS_UPDATE, token })
const removeToken = (token: TokenModel) => ({ type: TOKENS_REMOVE, token })

export const watchToken = (notice: TokenNoticeModel) => async (dispatch, getState) => {

  const token = notice.token().isFetching(false).isFetched(true).isERC20(true)
  if (notice.token()) {
    dispatch({ type: TOKENS_REMOVE, token: notice.oldAddress() })
    dispatch({ type: TOKENS_FETCHED, token })
    tokenService.createDAO(token)
  }

  dispatch(notice.isRemoved()
    ? removeToken(token)
    : setToken(token))

  if (getState().get(DUCK_SESSION).isCBE) {
    dispatch(notify(notice))
  }
}

export const watchInitERC20Tokens = () => async (dispatch, getState) => {
  const callback = (notice) => dispatch(watchToken(notice))
  const dao = daoByType('ERC20Manager')(getState())

  dao.addWatchers(callback)
  // return Promise.all([
  //   dao.watchAdd(callback),
  //   dao.watchModify(callback),
  //   dao.watchRemove(callback),
  // ])
}

export const formTokenLoadMetaData = (token: TokenModel, ownProps) => async (dispatch, getState) => {
  const errors = {}
  dispatch({ type: TOKENS_FORM_FETCH })
  const managerDAO = daoByType('ERC20Manager')(getState())
  const symbolAddress = token.symbol() && await managerDAO.getTokenAddressBySymbol(token.symbol())

  if (ownProps.tokens.getByAddress(token.address()).isFetched() && !ownProps.isModify) {
    errors.address = 'settings.erc20.tokens.errors.addressInUse'
  }

  if ((symbolAddress !== null && token.address() !== symbolAddress) || (token.symbol() && [ETH].includes(token.symbol().toUpperCase()) )) {
    errors.symbol = 'settings.erc20.tokens.errors.symbolInUse'
  }

  dispatch({ type: TOKENS_FORM_FETCH, end: true })
  if (Object.values(errors).length) {
    throw errors
  }
}

export const addToken = (token: TokenModel | AbstractFetchingModel) => async (dispatch, getState) => {
  dispatch(setToken(token.isFetching(true)))
  const dao = daoByType('ERC20Manager')(getState())
  try {
    await dao.addToken(token)
  } catch (e) {
    dispatch(removeToken(token))
  }
}

export const modifyToken = (oldToken: TokenModel | AbstractFetchingModel, newToken: TokenModel) => async (dispatch, getState) => {
  dispatch(removeToken(oldToken))
  dispatch(setToken(newToken.isFetching(true)))
  const dao = daoByType('ERC20Manager')(getState())
  try {
    await dao.modifyToken(oldToken, newToken.totalSupply(new Amount(0, newToken.symbol())))
  } catch (e) {
    dispatch(removeToken(newToken))
    dispatch(setToken(oldToken))
  }
}

export const revokeToken = (token: TokenModel | AbstractFetchingModel) => async (dispatch, getState) => {
  dispatch(setToken(token.isFetching(true)))
  const dao = daoByType('ERC20Manager')(getState())
  try {
    await dao.removeToken(token)
  } catch (e) {
    dispatch(setToken(token.isFetching(false)))
  }
}
