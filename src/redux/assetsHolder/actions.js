import { DUCK_REWARDS } from '@/redux/rewards/actions'
import { EVENT_APPROVAL_TRANSFER, EVENT_NEW_TRANSFER } from 'dao/AbstractTokenDAO'
import AssetHolderDAO from 'dao/AssetHolderDAO'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import Amount from 'models/Amount'
import AssetModel from 'models/assetHolder/AssetModel'
import TokenModel from 'models/tokens/TokenModel'
import AllowanceModel from 'models/wallet/AllowanceModel'
import { WALLET_ALLOWANCE } from 'redux/mainWallet/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import tokenService, { EVENT_NEW_TOKEN } from 'services/TokenService'

export const DUCK_ASSETS_HOLDER = 'assetsHolder'

export const ASSET_HOLDER_INIT = 'assetHolder/INIT'
export const ASSET_HOLDER_ADDRESS = 'assetHolder/timeHolderAddress'
export const ASSET_HOLDER_ASSET_UPDATE = 'assetHolder/assetUpdate'

let assetHolderDAO: AssetHolderDAO = null

const subscribeOnTokens = (token: TokenModel) => async (dispatch, getState) => {
  const assetHolder = getState().get(DUCK_ASSETS_HOLDER)
  const assets = assetHolder.assets()

  if (!token.isERC20() || !assets.list().has(token.address())) {
    return
  }

  const holderAccount = assetHolder.account()

  // set symbol for asset
  const asset = assets.item(token.address()).symbol(token.symbol())
  dispatch({ type: ASSET_HOLDER_ASSET_UPDATE, asset })

  // subscribe to token
  const tokenDAO = tokenService.getDAO(token.id())
  tokenDAO
    .on(EVENT_APPROVAL_TRANSFER, (results) => {
      console.log('--actions#approve', 1111, results)
    })
    .on(EVENT_NEW_TRANSFER, (tx) => {
      console.log('--actions#deposit', 2222, tx.toJS())
    })
    .watch(holderAccount)

  // fetch deposit
  dispatch(updateAssetDeposit(token))

  // fetch allowance
  dispatch(updateAssetAllowance(token))
}

export const updateAssetDeposit = (token: TokenModel) => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const deposit = await assetHolderDAO.getDeposit(account)
  const asset = getState().get(DUCK_ASSETS_HOLDER).assets().item(token.address()).deposit(new Amount(
    deposit,
    token.symbol()
  ))
  dispatch({ type: ASSET_HOLDER_ASSET_UPDATE, asset })
}

export const updateAssetAllowance = (token: TokenModel) => async (dispatch, getState) => {
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
    }),
  })
}

export const initAssetsHolder = () => async (dispatch, getState) => {
  if (getState().get(DUCK_ASSETS_HOLDER).isInited()) {
    return
  }
  dispatch({ type: ASSET_HOLDER_INIT, inInited: true })

  // init holder
  assetHolderDAO = await contractsManagerDAO.getAssetHolderDAO()
  const [ account, wallet ] = await Promise.all([
    assetHolderDAO.getAddress(),
    assetHolderDAO.getWalletAddress(),
  ])
  dispatch({ type: ASSET_HOLDER_ADDRESS, account, wallet })

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

  // subscribe to tokens
  const callback = (token) => dispatch(subscribeOnTokens(token))
  tokenService.on(EVENT_NEW_TOKEN, callback)
  // fetch for existing tokens
  const tokens = getState().get(DUCK_TOKENS)
  tokens.list().forEach(callback)
}

export const depositAsset = (amount: Amount) => async (dispatch, getState) => {
  try {
    await assetHolderDAO.deposit(amount)
  } catch (e) {
    // eslint-disable-next-line
    console.error('deposit error', e.message)
  } finally {
    const tokenTIME = getState().get(DUCK_TOKENS).item('TIME')
    dispatch(updateAssetAllowance(tokenTIME))
    dispatch(updateAssetDeposit(tokenTIME))
  }
}

export const withdrawAsset = (amount: Amount) => async (dispatch, getState) => {
  // const amountBN = new BigNumber(amount)
  // dispatch(depositMinus(amountBN))
  const tokenTIME = getState().get(DUCK_TOKENS).item('TIME')

  try {
    await assetHolderDAO.withdraw(amount)
  } catch (e) {
    // eslint-disable-next-line
    console.error('withdraw error', e.message)
  } finally {
    dispatch(updateAssetDeposit(tokenTIME))
    // dispatch(depositPlus(amountBN))
  }
}
