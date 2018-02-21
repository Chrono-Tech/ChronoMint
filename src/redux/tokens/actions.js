import { nemProvider } from '@chronobank/login/network/NemProvider'
import BitcoinDAO, { bccDAO, btcDAO, btgDAO, EVENT_BTC_LIKE_TOKEN_CREATED, EVENT_BTC_LIKE_TOKEN_FAILED, ltcDAO } from 'dao/BitcoinDAO'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ERC20ManagerDAO, { EVENT_ERC20_TOKENS_COUNT, EVENT_NEW_ERC20_TOKEN } from 'dao/ERC20ManagerDAO'
import ethereumDAO from 'dao/EthereumDAO'
import NemDAO, { NEM_XEM_NAME, NEM_XEM_SYMBOL, NEM_DECIMALS, EVENT_NEM_LIKE_TOKEN_CREATED, EVENT_NEM_LIKE_TOKEN_FAILED } from 'dao/NemDAO'
import TokenModel from 'models/tokens/TokenModel'
import TransferErrorNoticeModel from 'models/notices/TransferErrorNoticeModel'
import type TransferExecModel from 'models/TransferExecModel'
import TransferError, { TRANSFER_CANCELLED, TRANSFER_UNKNOWN } from 'models/TransferError'
import tokenService, { EVENT_NEW_TOKEN } from 'services/TokenService'
import { notify } from 'redux/notifier/actions'
import { showConfirmTransferModal } from 'redux/ui/actions'

export const DUCK_TOKENS = 'tokens'
export const TOKENS_UPDATE = 'tokens/update'
export const TOKENS_INIT = 'tokens/init'
export const TOKENS_FETCHING = 'tokens/fetching'
export const TOKENS_FETCHED = 'tokens/fetched'
export const TOKENS_REMOVE = 'tokens/remove'
export const TOKENS_FAILED = 'tokens/failed'

// add new tokens here
const MANDATORY_TOKENS_COUNT = ['TIME', 'BTC', 'BCC', 'ETH', 'LTC', 'BTG', 'XEM', 'XMIN']

// It is not a redux action
const submitTxHandler = (dao, dispatch) => async (tx: TransferExecModel) => {
  try {
    await dispatch(showConfirmTransferModal(dao, tx))
  } catch (e) {
    // eslint-disable-next-line
    console.error('Transfer error', e)
    const e = new TransferError(e.message, TRANSFER_UNKNOWN)
    dispatch(notify(new TransferErrorNoticeModel(tx, e)))
  }
}

// It is not a redux action
const acceptTxHandler = (dao, dispatch) => async (tx: TransferExecModel) => {
  try {
    // TODO @ipavlenko: Pass arguments
    await dao.immediateTransfer(tx.from(), tx.to(), tx.amount(), tx.amountToken(), tx.feeMultiplier())
  } catch (e) {
    // eslint-disable-next-line
    console.error('Transfer error', e)
    const e = new TransferError(e.message, TRANSFER_UNKNOWN)
    dispatch(notify(new TransferErrorNoticeModel(tx, e)))
  }
}

// It is not a redux action
const rejectTxHandler = (dao, dispatch) => async (tx: TransferExecModel) => {
  const e = new TransferError('Rejected', TRANSFER_CANCELLED)
  dispatch(notify(new TransferErrorNoticeModel(tx, e)))
}

export const alternateTxHandlingFlow = (dao) => (dispatch) => {
  dao
    .on('submit', submitTxHandler(dao, dispatch))
    .on('accept', acceptTxHandler(dao, dispatch))
    .on('reject', rejectTxHandler(dao, dispatch))
}

export const initTokens = () => async (dispatch, getState) => {
  if (getState().get(DUCK_TOKENS).isInited()) {
    return
  }
  dispatch({ type: TOKENS_INIT, isInited: true })

  dispatch({ type: TOKENS_FETCHING, count: MANDATORY_TOKENS_COUNT.length })

  // eth
  const eth: TokenModel = await ethereumDAO.getToken()
  if (eth) {
    dispatch({ type: TOKENS_FETCHED, token: eth })
    tokenService.registerDAO(eth, ethereumDAO)
  }

  const erc20: ERC20ManagerDAO = await contractsManagerDAO.getERC20ManagerDAO()
  erc20
    .on(EVENT_ERC20_TOKENS_COUNT, (count) => {
      // TIME is already counted in mandatory list, so decrement
      // also this hack is needed to prevent isFetched=true before erc20 tokens are fetched
      const currentCount = getState().get(DUCK_TOKENS).leftToFetch() - 1
      dispatch({ type: TOKENS_FETCHING, count: currentCount + count })
    })
    .on(EVENT_NEW_ERC20_TOKEN, (token: TokenModel) => {
      dispatch({ type: TOKENS_FETCHED, token })
      tokenService.createDAO(token)
    })
    .fetchTokens()

  // btc-likes
  const btcLikeTokens = [ btcDAO, bccDAO, btgDAO, ltcDAO ]
  btcLikeTokens.forEach((btcLikeDAO: BitcoinDAO) => {
    btcLikeDAO
      .on(EVENT_BTC_LIKE_TOKEN_CREATED, (token, dao) => {
        dispatch({ type: TOKENS_FETCHED, token })
        tokenService.registerDAO(token, dao)
        dispatch(alternateTxHandlingFlow(dao))
      })
      .on(EVENT_BTC_LIKE_TOKEN_FAILED, () => {
        dispatch({ type: TOKENS_FAILED })
      })
      .fetchToken()
  })

  // nem tokens
  const mosaicsDAOs = nemProvider.getMosaics().map((m) => new NemDAO(m.name, m.symbol, nemProvider, m.decimals, m.definition))
  const nemDAOs =  [
    new NemDAO(NEM_XEM_NAME, NEM_XEM_SYMBOL, nemProvider, NEM_DECIMALS),
    ...mosaicsDAOs,
  ]

  nemDAOs.forEach((nemDAO: NemDAO) => {
    nemDAO
      .on(EVENT_NEM_LIKE_TOKEN_FAILED, () => {
        dispatch({ type: TOKENS_FAILED })
      })
      .on(EVENT_NEM_LIKE_TOKEN_CREATED, (token: TokenModel, dao) => {
        dispatch({ type: TOKENS_FETCHED, token })
        tokenService.registerDAO(token, dao)
        dispatch(alternateTxHandlingFlow(dao))
      })
      .fetchToken()
  })
}

export const subscribeOnTokens = (callback) => (dispatch, getState) => {
  const handleToken = (token) => dispatch(callback(token))
  tokenService.on(EVENT_NEW_TOKEN, handleToken)
  // fetch for existing tokens
  const tokens = getState().get(DUCK_TOKENS)
  tokens.list().forEach(handleToken)
}
