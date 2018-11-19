/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { LABOR_HOUR_NETWORK_CONFIG } from '@chronobank/login/network/settings'
import { daoByType, getLXToken, getLXTokenByAddress, getMainLaborHourWallet, getMiningParams } from '../selectors/mainSelectors'
import web3Factory from '../../../web3'
import { EVENT_CLOSE, EVENT_EXPIRE, EVENT_OPEN, EVENT_REVOKE } from '../constants'
import { notify } from '../../notifier/actions'
import SimpleNoticeModel from '../../../models/notices/SimpleNoticeModel'
import web3Converter from '../../../utils/Web3Converter'
import { getMainEthWallet } from '../../wallets/selectors/models'
import { closeSwap, obtainSwapByMiddlewareFromMainnetToSidechain } from './mainnetToSidechain'
import { executeLaborHourTransaction, updateLaborHourBalances, updateTimeHolderBalances } from './transactions'
import { EVENT_BECOME_MINER, EVENT_DEPOSIT, EVENT_WITHDRAW_SHARES } from '../dao/TimeHolderDAO'
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
    const { isCustomNode, delegateAddress } = getMiningParams(getState())
    dispatch(updateLaborHourBalances())
    dispatch(updateTimeHolderBalances())
    if (isCustomNode) {
      dispatch(startMiningInCustomNode(delegateAddress))
    }
  })
  timeHolderDAO.watchEvent(EVENT_BECOME_MINER, (/*event*/) => {
    dispatch(updateLaborHourBalances())
    dispatch(updateTimeHolderBalances())
  })

  timeHolderDAO.watchEvent(EVENT_WITHDRAW_SHARES, (event) => dispatch(withdrawSharesCallback(event)))
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
}

const openCallback = (event) => async (dispatch) => {
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
  await dispatch(updateLaborHourBalances())
  const { isCustomNode } = getMiningParams(getState())
  if (isCustomNode) {
    dispatch(startMiningInCustomNode())
  } else {
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

const withdrawSharesCallback = (event) => async (dispatch, getState) => {
  try {
    await dispatch(updateLaborHourBalances())
    const lhtWallet = getMainLaborHourWallet(getState())
    const { token: tokenAddress } = event.returnValues
    const token = getLXTokenByAddress(tokenAddress.toLowerCase())(getState())
    const platformDao = daoByType('ChronoBankPlatformSidechain')(getState())
    const web3 = web3Factory(LABOR_HOUR_NETWORK_CONFIG)
    const mainEthWallet = getMainEthWallet(getState())

    const promises = [
      web3.eth.net.getId(),
      web3.eth.getTransactionCount(mainEthWallet.address, 'pending'),
    ]
    const [chainId, nonce] = await Promise.all(promises)

    const tx = {
      ...platformDao.revokeAsset(
        web3Converter.stringToBytes(token.symbol()),
        lhtWallet.balances[token.symbol()],
      ),
      gas: 5700000, // TODO @Abdulov remove hard code and do something
      gasPrice: 80000000000,
      nonce: nonce,
      chainId: chainId,
    }
    dispatch(executeLaborHourTransaction({ tx }))
  } catch (e) {
    // eslint-disable-next-line
    console.error('deposit error', e)
  }
}
