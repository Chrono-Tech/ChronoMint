/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import {
  TOKENS_FAILED,
  TOKENS_FETCHED,
  TOKENS_FETCHING,
  TOKENS_INIT,
  TOKENS_UPDATE_LATEST_BLOCK,
} from './constants'

export const tokensInit = () => ({
  type: TOKENS_INIT,
})

export const setTokensFetchingCount = (count) => ({
  type: TOKENS_FETCHING,
  count,
})

export const tokenFetched = (token) => ({
  type: TOKENS_FETCHED,
  token,
})

export const tokensLoadingFailed = () => ({
  type: TOKENS_FAILED,
})

export const setLatestBlock = (blockchain, block) => ({
  type: TOKENS_UPDATE_LATEST_BLOCK,
  blockchain,
  block,
})
