/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { daoByType, getLXToken, getLXTokens, getMiningParams } from '../selectors/mainSelectors'
import { EVENT_CLOSE, EVENT_EXPIRE, EVENT_OPEN, EVENT_REVOKE } from '../constants'
import { notify } from '../../notifier/actions'
import SimpleNoticeModel from '../../../models/notices/SimpleNoticeModel'
import web3Converter from '../../../utils/Web3Converter'
import SidechainMiddlewareService from '../SidechainMiddlewareService'
import { getMainEthWallet } from '../../wallets/selectors/models'
import { obtainSwapByMiddlewareFromSidechainToMainnet, unlockShares } from './sidechainToMainnet'
import { obtainSwapByMiddlewareFromMainnetToSidechain, closeSwap } from './mainnetToSidechain'
import { getTokenBalance } from './transactions'
import { EVENT_DEPOSIT, EVENT_BECOME_MINER } from '../dao/TimeHolderDAO'
import { startMiningInCustomNode, startMiningInPoll } from './mining'

// eslint-disable-next-line
export const watch = () => (dispatch, getState) => {
  const chronoBankPlatformSidechainDAO = daoByType('ChronoBankPlatformSidechain')(getState())
  chronoBankPlatformSidechainDAO.watchEvent(EVENT_REVOKE, (event) => dispatch(revokeCallback(event)))

  const atomicSwapERC20DAO = daoByType('AtomicSwapERC20')(getState())
  atomicSwapERC20DAO.watchEvent(EVENT_OPEN, (event) => dispatch(openCallback(event)))
  atomicSwapERC20DAO.watchEvent(EVENT_CLOSE, (event) => dispatch(closeCallback(event)))
  atomicSwapERC20DAO.watchEvent(EVENT_EXPIRE, (event) => dispatch(expireCallback(event)))

  const timeHolderDAO = daoByType('TimeHolderSidechain')(getState())
  timeHolderDAO.watchEvent(EVENT_DEPOSIT, (event) => {
    // TODO @abdulov remove console.log
    console.log('%c event EVENT_DEPOSIT', 'background: #222; color: #fff', event)
  })
  timeHolderDAO.watchEvent(EVENT_BECOME_MINER, (event) => {
    // TODO @abdulov remove console.log
    console.log('%c event EVENT_BECOME_MINER', 'background: #222; color: #fff', event)
  })

}

const revokeCallback = (event) => async (dispatch, getState) => {
  const { symbol, value } = event.returnValues
  const token = getLXToken(web3Converter.bytesToString(symbol))(getState())

  dispatch(
    notify(
      new SimpleNoticeModel({
        title: 'chronoBankPlatformSidechain.revoke.title',
        message: 'chronoBankPlatformSidechain.revoke.message',
        params: {
          amount: token.removeDecimals(new BigNumber(value)),
          symbol: token.symbol(),
        },
      }),
    ),
  )

  const mainEthWallet = getMainEthWallet(getState())
  const { data } = await SidechainMiddlewareService.getSwapListFromSidechainToMainnetByAddress(mainEthWallet.address)
  const swap = data[data.length - 1] // last swap.
  if (swap) {
    const { data } = await dispatch(obtainSwapByMiddlewareFromSidechainToMainnet(swap.swapId))
    if (data) {
      dispatch(unlockShares(swap.swapId, data))
    }
  }
}

const openCallback = (event) => async (dispatch, getState) => {
  const swapId = web3Converter.bytesToString(event.returnValues._swapID)
  dispatch(
    notify(
      new SimpleNoticeModel({
        icon: 'lock',
        title: 'atomicSwapERC20.lock.title',
        message: 'atomicSwapERC20.lock.message',
        params: {
          id: swapId,
        },
      }),
    ),
  )
  // obtain swap
  const { data } = await dispatch(obtainSwapByMiddlewareFromMainnetToSidechain(swapId))
  if (data) {
    dispatch(closeSwap(data, swapId))
  }
}

const closeCallback = (event) => async (dispatch, getState) => {
  const { _swapID: swapId } = event.returnValues
  dispatch(
    notify(
      new SimpleNoticeModel({
        title: 'atomicSwapERC20.close.title',
        message: 'atomicSwapERC20.close.message',
        params: {
          id: web3Converter.bytesToString(swapId),
        },
      }),
    ),
  )
  const tokens = getLXTokens(getState())
  await Promise.all(tokens
    .items()
    .map((token) => {
      const tokenDao = daoByType(token.symbol())(getState())
      return dispatch(getTokenBalance(tokenDao))
    }))
  const { isCustomNode } = getMiningParams(getState())
  if(isCustomNode){
    dispatch(startMiningInCustomNode())
  }else{
    dispatch(startMiningInPoll())
  }
}

const expireCallback = (event) => (dispatch) => {
  const { _swapID: swapId } = event.returnValues
  dispatch(
    notify(
      new SimpleNoticeModel({
        title: 'atomicSwapERC20.expire.title',
        message: 'atomicSwapERC20.expire.message',
        params: {
          id: web3Converter.bytesToString(swapId),
        },
      }),
    ),
  )
}
