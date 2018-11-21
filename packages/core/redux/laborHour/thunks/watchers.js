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
import { closeSwap, obtainSwapByMiddlewareFromMainnetToSidechain } from './mainnetToSidechain'
import { executeLaborHourTransaction, updateLaborHourBalances, updateTimeHolderBalances } from './transactions'
import { EVENT_BECOME_MINER, EVENT_DEPOSIT, EVENT_RESIGN_MINER, EVENT_WITHDRAW_SHARES } from '../dao/TimeHolderDAO'
import { startMiningInCustomNode, depositInSidechain } from './mining'

// eslint-disable-next-line
export const watch = () => (dispatch, getState) => {
  const chronoBankPlatformSidechainDAO = daoByType('ChronoBankPlatformSidechain')(getState())
  const atomicSwapERC20DAO = daoByType('AtomicSwapERC20')(getState())
  const timeHolderDAO = daoByType('TimeHolderSidechain')(getState())

  chronoBankPlatformSidechainDAO.watchEvent(EVENT_REVOKE, (event) => dispatch(revokeCallback(event)))

  atomicSwapERC20DAO.watchEvent(EVENT_OPEN, (event) => dispatch(openCallback(event)))
  atomicSwapERC20DAO.watchEvent(EVENT_CLOSE, (event) => dispatch(closeCallback(event)))
  atomicSwapERC20DAO.watchEvent(EVENT_EXPIRE, (event) => dispatch(expireCallback(event)))

  timeHolderDAO.watchEvent(EVENT_DEPOSIT, (event) => (dispatch(depositCallback(event))))
  timeHolderDAO.watchEvent(EVENT_BECOME_MINER, (event) => dispatch(becomeMinerCallback(event)))
  timeHolderDAO.watchEvent(EVENT_WITHDRAW_SHARES, (event) => dispatch(withdrawSharesCallback(event)))
  timeHolderDAO.watchEvent(EVENT_RESIGN_MINER, (event) => dispatch(resignMinerCallback(event)))
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

const closeCallback = (event) => async (dispatch) => {
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
  dispatch(depositInSidechain())
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

const depositCallback = (event) => async (dispatch, getState) => {
  const { token: tokenAddress, amount } = event.returnValues
  const timeToken = getLXTokenByAddress(tokenAddress.toLowerCase())(getState())
  dispatch(
    notify(
      new SimpleNoticeModel({
        icon: 'lock',
        title: 'timeHolder.deposit.title',
        message: 'timeHolder.deposit.message',
        params: {
          symbol: timeToken.symbol(),
          amount: timeToken.removeDecimals(amount).toNumber(),
        },
      }),
    ),
  )
  const { isCustomNode, delegateAddress } = getMiningParams(getState())
  await Promise.all([
    dispatch(updateLaborHourBalances()),
    dispatch(updateTimeHolderBalances()),
  ])
  if (isCustomNode) {
    dispatch(startMiningInCustomNode(delegateAddress))
  }
}

const becomeMinerCallback = (event) => (dispatch, getState) => {
  const { token: tokenAddress, miner, totalDepositLocked } = event.returnValues
  const timeToken = getLXTokenByAddress(tokenAddress.toLowerCase())(getState())
  dispatch(
    notify(
      new SimpleNoticeModel({
        icon: 'lock',
        title: 'timeHolder.becomeMiner.title',
        message: 'timeHolder.becomeMiner.message',
        params: {
          miner,
          amount: timeToken.removeDecimals(totalDepositLocked).toNumber(),
          symbol: timeToken.symbol(),
        },
      }),
    ),
  )
  dispatch(updateLaborHourBalances())
  dispatch(updateTimeHolderBalances())
}

const withdrawSharesCallback = (event) => async (dispatch, getState) => {
  try {
    const { token: tokenAddress, amount } = event.returnValues
    const timeToken = getLXTokenByAddress(tokenAddress.toLowerCase())(getState())
    dispatch(
      notify(
        new SimpleNoticeModel({
          icon: 'lock',
          title: 'timeHolder.withdrawShares.title',
          message: 'timeHolder.withdrawShares.message',
          params: {
            amount: timeToken.removeDecimals(amount).toNumber(),
            symbol: timeToken.symbol(),
          },
        }),
      ),
    )

    await dispatch(updateLaborHourBalances())
    const lhtWallet = getMainLaborHourWallet(getState())
    const token = getLXTokenByAddress(tokenAddress.toLowerCase())(getState())
    const platformDao = daoByType('ChronoBankPlatformSidechain')(getState())
    const web3 = web3Factory(LABOR_HOUR_NETWORK_CONFIG)

    const promises = [
      web3.eth.net.getId(),
      web3.eth.getTransactionCount(lhtWallet.address, 'pending'),
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
    await dispatch(executeLaborHourTransaction({ tx }))
  } catch (e) {
    // eslint-disable-next-line
    console.error('deposit error', e)
  }
}

const resignMinerCallback = (event) => async (dispatch, getState) => {
  try {
    const { token: tokenAddress, depositUnlocked } = event.returnValues
    const timeToken = getLXTokenByAddress(tokenAddress.toLowerCase())(getState())
    dispatch(
      notify(
        new SimpleNoticeModel({
          icon: 'lock',
          title: 'timeHolder.resignMiner.title',
          message: 'timeHolder.resignMiner.message',
          params: {
            amount: timeToken.removeDecimals(depositUnlocked).toNumber(),
            symbol: timeToken.symbol(),
          },
        }),
      ),
    )

    await Promise.all([
      dispatch(updateLaborHourBalances()),
      dispatch(updateTimeHolderBalances()),
    ])
  } catch (e) {
    // eslint-disable-next-line
    console.error('deposit error', e)
  }
}
