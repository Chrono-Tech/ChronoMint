/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import BlockRewardsMiddlewareService from '../BlockRewardsMiddlewareService'
import { getMainLaborHourWallet, selectRewardsBlocksListLength } from '../selectors'
import { setRewardsBlocksList, setRewardsBlocksListLoadingFlag, setTotalRewards } from '../actions'

const PAGE_LENGTH = 20

export const getGetRewardsInfo = () => (dispatch) => {
  dispatch(getTotalReward())
  dispatch(getRewardsBlocksList())
}

export const getTotalReward = () => async (dispatch, getState) => {
  const wallet = getMainLaborHourWallet(getState())
  const { data } = await BlockRewardsMiddlewareService.getTotalReward(wallet.address)
  dispatch(setTotalRewards(data))
}

export const getRewardsBlocksList = () => async (dispatch, getState) => {
  const state = getState()
  const skip = selectRewardsBlocksListLength(state)
  dispatch(setRewardsBlocksListLoadingFlag(true))
  const { data } = await BlockRewardsMiddlewareService.getBlocksList(skip, PAGE_LENGTH)
  setTimeout(() => {
    dispatch(setRewardsBlocksList(data.reduce((accumulator, block) => {
      return {
        ...accumulator,
        [block.number]: block,
      }
    }, {})))
  }, 5000)
}

export const getRewardsBlock = (blockNumberOrHash) => (dispatch) => {
  const { data: block } = BlockRewardsMiddlewareService.getBlock(blockNumberOrHash)
  dispatch(setRewardsBlocksList({
    [block.number]: block,
  }))
}

