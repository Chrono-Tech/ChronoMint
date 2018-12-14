/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import BlockRewardsMiddlewareService from '../BlockRewardsMiddlewareService'
import { getMainLaborHourWallet, selectRewardsBlocksListLength } from '../selectors/mainSelectors'
import { setRewardsBlocksList, setTotalRewards } from '../actions'

const PAGE_LENGTH = 20

export const getTotalReward = () => (dispatch, getState) => {
  const wallet = getMainLaborHourWallet(getState())
  const { data } = BlockRewardsMiddlewareService.getTotalReward(wallet.address)
  dispatch(setTotalRewards(data))
}

export const getRewardsBlocksList = () => (dispatch, getState) => {
  const state = getState()
  const skip = selectRewardsBlocksListLength(state)
  const { data } = BlockRewardsMiddlewareService.getBlocksList(skip, PAGE_LENGTH)
  // TODO @Abdulov add ending flag
  dispatch(setRewardsBlocksList(data.reduce((accumulator, block) => {
    return {
      ...accumulator,
      [block.number]: block,
    }
  }, {})))
}

export const getRewardsBlock = (blockNumberOrHash) => (dispatch) => {
  const { data: block } = BlockRewardsMiddlewareService.getBlock(blockNumberOrHash)
  dispatch(setRewardsBlocksList({
    [block.number]: block,
  }))
}

