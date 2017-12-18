import { DUCK_SESSION } from '@/redux/session/actions'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import TIMEHolderDAO from 'dao/TIMEHolderDAO'
import Amount from 'models/Amount'
import ApprovalNoticeModel from 'models/notices/ApprovalNoticeModel'
import TokenModel from 'models/tokens/TokenModel'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import tokenService, { EVENT_NEW_TOKEN } from 'services/TokenService'

export const DUCK_ASSETS_HOLDER = 'assetsHolder'

export const TIME_HOLDER_INIT = 'timeHolder/INIT'
export const TIME_HOLDER_TIME_ADDRESS = 'timeHolder/timeAddress'
export const TIME_HOLDER_WALLET_ADDRESS = 'timeHolder/timeHolderWalletAddress'
export const TIME_HOLDER_ADDRESS = 'timeHolder/timeHolderAddress'

let timeHolderDAO: TIMEHolderDAO = null

const subscribeOnTokens = (token: TokenModel) => async (dispatch, getState) => {
  if (token.symbol() !== 'TIME') {
    return
  }

  dispatch({ type: TIME_HOLDER_TIME_ADDRESS, address: token.address() })

  // init
  const [ timeHolderAddress, timeHolderWalletAddress ] = await Promise.all([
    timeHolderDAO.getAddress(),
    timeHolderDAO.getWalletAddress(),
  ])

  dispatch({ type: TIME_HOLDER_ADDRESS, address: timeHolderAddress })
  dispatch({ type: TIME_HOLDER_WALLET_ADDRESS, address: timeHolderWalletAddress })

  // TODO @dkchv: review again
  const contractNames = {}
  contractNames[ timeHolderAddress ] = 'TIME Holder'
  ApprovalNoticeModel.setContractNames(contractNames)

  // update allowance
  const timeDAO = tokenService.getDAO(token.id())
  const { account } = getState().get(DUCK_SESSION)
  const [ timeHolderAllowance, timeHolderWalletAllowance ] = await Promise.all([
    timeDAO.getAccountAllowance(timeHolderAddress, account),
    timeDAO.getAccountAllowance(timeHolderWalletAddress, account),
  ])

  console.log('--assetHolder: ', +timeHolderAllowance, +timeHolderWalletAllowance)

  // token = token
  //   .setAllowance(timeHolderAddress, timeHolderAllowance)
  //   .setAllowance(timeHolderWalletAddress, timeHolderWalletAllowance)
}

export const initAssetsHolder = () => async (dispatch, getState) => {
  if (getState().get(DUCK_ASSETS_HOLDER).isInited()) {
    return
  }
  dispatch({ type: TIME_HOLDER_INIT, inInited: true })

  const { account } = getState().get(DUCK_SESSION)
  timeHolderDAO = await contractsManagerDAO.getTIMEHolderDAO()
  const [ assets, deposit ] = await Promise.all([
    timeHolderDAO.getSharesContract(),
    timeHolderDAO.getDeposit(account),
  ])
  console.log('--deposit', assets, +deposit)

  // subscribe to tokens
  const callback = (token) => dispatch(subscribeOnTokens(token))
  tokenService.on(EVENT_NEW_TOKEN, callback)
  // fetch for existing tokens
  const tokens = getState().get(DUCK_TOKENS)
  tokens.list().forEach(callback)
}

export const depositAsset = (amount: Amount, token: TokenModel) => async (dispatch) => {
  // const amountBN = new BigNumber(amount)

  // dispatch(balanceMinus(amountBN, token))
  const assetDAO = tokenService.getDAO(token)

  try {
    await timeHolderDAO.deposit(amount, assetDAO)
  } catch (e) {
    // eslint-disable-next-line
    console.error('deposit error', e.message)
  } finally {
    // compensation for update in watchTransfer
    // dispatch(balancePlus(amount, token))
  }
}

export const withdrawAsset = (amount: Amount, token: TokenModel) => async () => {
  // const amountBN = new BigNumber(amount)

  // dispatch(depositMinus(amountBN))
  const assetDAO = tokenService.getDAO(token)

  try {
    await timeHolderDAO.withdraw(amount, assetDAO)
  } catch (e) {
    // eslint-disable-next-line
    console.error('withdraw error', e.message)
  } finally {
    // dispatch(depositPlus(amountBN))
  }
}
