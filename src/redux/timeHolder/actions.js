import contractsManagerDAO from 'dao/ContractsManagerDAO'
import type TIMEHolderDAO from 'dao/TIMEHolderDAO'
import ApprovalNoticeModel from 'models/notices/ApprovalNoticeModel'
import TokenModel from 'models/tokens/TokenModel'
import tokenService from 'services/TokenService'

const DUCK_TIME_HOLDER = 'timeHolder'

export const TIME_HOLDER_INIT = 'timeHolder/INIT'
export const TIME_HOLDER_TIME_ADDRESS = 'timeHolder/timeAddress'
export const TIME_HOLDER_WALLET_ADDRESS = 'timeHolder/timeHolderWalletAddress'
export const TIME_HOLDER_ADDRESS = 'timeHolder/timeHolderAddress'

let timeHolderDAO: TIMEHolderDAO = null

export const initTimeHolder = (token: TokenModel) => async (dispatch, getState) => {
  if (getState().get(DUCK_TIME_HOLDER).isInited()) {
    return
  }
  dispatch({ type: TIME_HOLDER_INIT, inInited: true })

  dispatch({ type: TIME_HOLDER_TIME_ADDRESS, address: token.address() })

  // init
  timeHolderDAO = await contractsManagerDAO.getTIMEHolderDAO()
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
  const [ timeHolderAllowance, timeHolderWalletAllowance ] = await Promise.all([
    timeDAO.getAccountAllowance(timeHolderAddress),
    timeDAO.getAccountAllowance(timeHolderWalletAddress),
  ])

  console.log('--actions#', timeHolderAllowance, timeHolderWalletAllowance)

  // token = token
  //   .setAllowance(timeHolderAddress, timeHolderAllowance)
  //   .setAllowance(timeHolderWalletAddress, timeHolderWalletAllowance)
}

