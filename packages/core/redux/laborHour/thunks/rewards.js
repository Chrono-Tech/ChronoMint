/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import { laborHourProvider } from '@chronobank/login/network/LaborHourProvider'
import {
  getMainLaborHourWallet,
  selectRewardsBlocksListLength,
} from '../selectors'
import Amount from '../../../models/Amount'
import { LHT } from '../../../dao/constants/index'
import {
  setRewardsBlocksList,
  setRewardsBlocksListLoadingFlag,
  setTotalRewards,
} from '../actions'

export const getGetRewardsInfo = () => (dispatch) => {
  dispatch(getTotalReward())
  dispatch(getRewardsBlocksList())
}

export const getTotalReward = () => async (dispatch, getState) => {
  const wallet = getMainLaborHourWallet(getState())

  if (!wallet) {
    return null
  }

  const { data } = await laborHourProvider.getTotalReward(wallet.address)
  dispatch(setTotalRewards(new Amount(data, LHT)))
}

export const getRewardsBlocksList = () => async (dispatch, getState) => {
  const state = getState()
  const wallet = getMainLaborHourWallet(state)

  if (!wallet) {
    return null
  }

  const skip = selectRewardsBlocksListLength(state)
  dispatch(setRewardsBlocksListLoadingFlag(true))
  const data = await laborHourProvider.getBlocksList(wallet.address, skip)
  dispatch(
    setRewardsBlocksList(
      data.reduce((accumulator, block) => {
        return {
          ...accumulator,
          [block.number]: block,
        }
      }, {})
    )
  )
}

export const getRewardsBlock = (blockNumberOrHash) => (dispatch) => {
  const { data: block } = laborHourProvider.getBlock(blockNumberOrHash)
  dispatch(
    setRewardsBlocksList({
      [block.number]: block,
    })
  )
}
