/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { EVENT_APPROVAL_TRANSFER, EVENT_NEW_TRANSFER } from '../../dao/AbstractTokenDAO'
import Amount from '../../models/Amount'
import AssetModel from '../../models/assetHolder/AssetModel'
import TokenModel from '../../models/tokens/TokenModel'
import AllowanceModel from '../../models/wallet/AllowanceModel'
import { WALLET_ALLOWANCE } from '../mainWallet/actions'
import { DUCK_SESSION } from '../session/actions'
import { subscribeOnTokens } from '../tokens/actions'
import tokenService from '../../services/TokenService'
import { daoByType } from '../../refactor/redux/daos/selectors'

export const DUCK_ASSETS_HOLDER = 'assetsHolder'

export const ASSET_HOLDER_INIT = 'assetHolder/INIT'
export const ASSET_HOLDER_ADDRESS = 'assetHolder/timeHolderAddress'
export const ASSET_HOLDER_ASSET_UPDATE = 'assetHolder/assetUpdate'

const handleToken = (token: TokenModel) => async (dispatch, getState) => {
  const assetHolder = getState().get(DUCK_ASSETS_HOLDER)
  const assets = assetHolder.assets()

  if (!token.isERC20() || !assets.list().has(token.address())) {
    return
  }

  const holderAccount = assetHolder.account()
  const holderWallet = assetHolder.wallet()

  // set symbol for asset
  const asset = assets.item(token.address()).symbol(token.symbol())
  dispatch({ type: ASSET_HOLDER_ASSET_UPDATE, asset })

  // subscribe to token
  const tokenDAO = tokenService.getDAO(token.id())
  tokenDAO
    .on(EVENT_APPROVAL_TRANSFER, (results) => {
      if (results.from === holderWallet || results.spender === holderWallet) {
        dispatch(fetchAssetAllowance(token))
      }
    })
    .on(EVENT_NEW_TRANSFER, (tx) => {
      if (!(tx.from() === holderWallet || tx.to() === holderWallet)) {
        return
      }
      dispatch(fetchAssetDeposit(token))
      dispatch(fetchAssetAllowance(token))
    })

  // need to be uncomment
  // await tokenDAO.watch(holderAccount)

  // fetch deposit and allowance
  dispatch(fetchAssetDeposit(token))
  dispatch(fetchAssetAllowance(token))
}

export const fetchAssetDeposit = (token: TokenModel) => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const assetHolderDAO = daoByType('TimeHolder')(getState())
  const deposit = await assetHolderDAO.getDeposit(token.address(), account)
  const asset = getState().get(DUCK_ASSETS_HOLDER).assets().item(token.address()).deposit(new Amount(
    deposit,
    token.symbol(),
  ))
  dispatch({ type: ASSET_HOLDER_ASSET_UPDATE, asset })
}

export const fetchAssetAllowance = (token: TokenModel) => async (dispatch, getState) => {
  const assetHolder = getState().get(DUCK_ASSETS_HOLDER)
  const { account } = getState().get(DUCK_SESSION)

  const holderWallet = assetHolder.wallet()
  const tokenDAO = tokenService.getDAO(token.id())
  const assetHolderWalletAllowance = await tokenDAO.getAccountAllowance(account, holderWallet)

  dispatch({
    type: WALLET_ALLOWANCE, allowance: new AllowanceModel({
      amount: new Amount(assetHolderWalletAllowance, token.id()),
      spender: holderWallet,
      token: token.id(),
      isFetching: false,
      isFetched: true,
    }),
  })
}

export const initAssetsHolder = () => async (dispatch, getState) => {
  if (getState().get(DUCK_ASSETS_HOLDER).isInited()) {
    return
  }
  dispatch({ type: ASSET_HOLDER_INIT, inInited: true })

  const assetHolderDAO = daoByType('TimeHolder')(getState())
  const [ wallet ] = await Promise.all([
    assetHolderDAO.getWalletAddress(),
  ])

  dispatch({ type: ASSET_HOLDER_ADDRESS, account: assetHolderDAO.address, wallet })

  // get assets list
  const [ timeAddress ] = await Promise.all([
    assetHolderDAO.getSharesContract(),
  ])
  const assets = [ timeAddress ]
  assets.forEach((address) => {
    dispatch({
      type: ASSET_HOLDER_ASSET_UPDATE,
      asset: new AssetModel({
        address,
      }),
    })
  })

  dispatch(subscribeOnTokens(handleToken))
}

export const depositAsset = (amount: Amount, token: TokenModel, feeMultiplier: Number = 1, advancedOptions = undefined) => async (dispatch, getState) => {
  try {
    const assetHolderDAO = daoByType('TimeHolder')(getState())
    await assetHolderDAO.deposit(token.address(), amount, feeMultiplier, advancedOptions)
  } catch (e) {
    // eslint-disable-next-line
    console.error('deposit error', e.message)
  }
}

export const withdrawAsset = (amount: Amount, token: TokenModel, feeMultiplier: Number = 1, advancedOptions = undefined) => async (dispatch, getState) => {
  try {
    const assetHolderDAO = daoByType('TimeHolder')(getState())
    await assetHolderDAO.withdraw(token.address(), amount, feeMultiplier, advancedOptions)
  } catch (e) {
    // eslint-disable-next-line
    console.error('withdraw error', e.message)
  }
}
