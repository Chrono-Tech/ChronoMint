/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

//#region imports
import { LABOR_HOUR_NETWORK_CONFIG } from '@chronobank/login/network/settings'
import web3Factory from '../../../web3'
import { daoByType } from '../selectors/mainSelectors'
import { daoByType as daoByTypeMainnet } from '../../daos/selectors'
import Amount from '../../../models/Amount'
import web3Converter from '../../../utils/Web3Converter'
import TokenModel from '../../../models/tokens/TokenModel'
import SidechainMiddlewareService from '../SidechainMiddlewareService'
import { getEthereumSigner } from '../../persistAccount/selectors'
import { getMainEthWallet } from '../../wallets/selectors/models'
import { executeTransaction } from '../../ethereum/thunks'
import { executeLaborHourTransaction } from './transactions'
import { updateMiningNodeType } from '../actions'
import { notifyUnknownError } from './utilsThunks'
//#endregion

export const sidechainWithdraw = (
  amount: Amount,
  token: TokenModel,
  isCustomNode,
  delegateAddress,
  // feeMultiplier
) => async (dispatch, getState) => {
  try {
    const platformDao = daoByType('ChronoBankPlatformSidechain')(getState())
    const web3 = web3Factory(LABOR_HOUR_NETWORK_CONFIG)
    const mainEthWallet = getMainEthWallet(getState())

    dispatch(updateMiningNodeType(isCustomNode, delegateAddress))

    const promises = [
      web3.eth.net.getId(),
      web3.eth.getTransactionCount(mainEthWallet.address, 'pending'),
    ]
    const [chainId, nonce] = await Promise.all(promises)

    const tx = {
      ...platformDao.revokeAsset(
        web3Converter.stringToBytes(token.symbol()),
        amount,
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

export const obtainSwapByMiddlewareFromSidechainToMainnet = (swapId) => async (
  dispatch,
  getState,
) => {
  try {
    const signer = getEthereumSigner(getState())
    const {
      data,
    } = await SidechainMiddlewareService.obtainSwapFromSidechainToMainnet(
      swapId,
      signer.getPublicKey(),
    )
    return Promise.resolve({ e: null, data, swapId })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    dispatch(notifyUnknownError())
    return Promise.resolve({ e, swapId })
  }
}

export const unlockShares = (swapId, encodedKey) => async (
  dispatch,
  getState,
) => {
  try {
    const timeHolderDAO = daoByTypeMainnet('TimeHolder')(getState())
    const signer = getEthereumSigner(getState())
    const key = await signer.decryptWithPrivateKey(encodedKey)
    const tx = timeHolderDAO.unlockShares(
      web3Converter.stringToBytes(swapId),
      web3Converter.stringToBytes(key),
    )
    dispatch(executeTransaction({ tx }))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    dispatch(notifyUnknownError())
  }
}
