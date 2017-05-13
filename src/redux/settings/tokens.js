import { Map } from 'immutable'
import { showSettingsTokenViewModal, showSettingsTokenModal } from '../ui/modal'
import TokenContractsDAO from '../../dao/TokenContractsDAO'
import TokenContractModel from '../../models/contracts/TokenContractModel'
import PlatformDAO from '../../dao/PlatformDAO'
import { notify } from '../notifier/notifier'
import TokenContractNoticeModel from '../../models/notices/TokenContractNoticeModel'
import validator from '../../components/forms/validator'

export const TOKENS_LIST = 'settings/TOKENS_LIST'
export const TOKENS_VIEW = 'settings/TOKENS_VIEW'
export const TOKENS_BALANCES_NUM = 'settings/TOKENS_BALANCES_NUM'
export const TOKENS_BALANCES = 'settings/TOKENS_BALANCES'
export const TOKENS_FORM = 'settings/TOKENS_FORM'
export const TOKENS_UPDATE = 'settings/TOKENS_UPDATE' // for add purposes as well
export const TOKENS_REMOVE_TOGGLE = 'settings/TOKENS_REMOVE_TOGGLE'
export const TOKENS_REMOVE = 'settings/TOKENS_REMOVE'
export const TOKENS_ERROR = 'settings/TOKENS_ERROR' // all - add & modify & remove
export const TOKENS_HIDE_ERROR = 'settings/TOKENS_HIDE_ERROR'
export const TOKENS_FETCH_START = 'settings/TOKENS_FETCH_START'
export const TOKENS_FETCH_END = 'settings/TOKENS_FETCH_END'

const initialState = {
  list: new Map(),
  selected: new TokenContractModel(), // for modify & view purposes
  balances: new Map(),
  balancesNum: 0,
  balancesPageCount: 0,
  error: false, // or error contract address
  isFetched: false,
  isRemove: false,
  isFetching: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TOKENS_LIST:
      return {
        ...state,
        list: action.list,
        isFetched: true
      }
    case TOKENS_VIEW:
    case TOKENS_FORM:
      return {
        ...state,
        selected: action.token
      }
    case TOKENS_BALANCES_NUM:
      return {
        ...state,
        balancesNum: action.num,
        balancesPageCount: action.pages
      }
    case TOKENS_BALANCES:
      return {
        ...state,
        balances: action.balances
      }
    case TOKENS_UPDATE:
      const list = action.token.proxyAddress() ? state.list.delete(action.token.proxyAddress()) : state.list
      return {
        ...state,
        list: list.set(action.token.address(), action.token)
      }
    case TOKENS_REMOVE_TOGGLE:
      return {
        ...state,
        selected: action.token === null ? new TokenContractModel() : action.token,
        isRemove: action.token !== null
      }
    case TOKENS_REMOVE:
      return {
        ...state,
        list: state.list.delete(action.token.address())
      }
    case TOKENS_ERROR:
      return {
        ...state,
        error: action.address
      }
    case TOKENS_HIDE_ERROR:
      return {
        ...state,
        error: false
      }
    case TOKENS_FETCH_START:
      return {
        ...state,
        isFetching: true
      }
    case TOKENS_FETCH_END:
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}

const updateToken = (token: TokenContractModel) => ({type: TOKENS_UPDATE, token})
const removeToken = (token: TokenContractModel) => ({type: TOKENS_REMOVE, token})
export const showTokenError = (address: string) => ({type: TOKENS_ERROR, address})
export const hideTokenError = () => ({type: TOKENS_HIDE_ERROR})
export const removeTokenToggle = (token: TokenContractModel = null) => ({type: TOKENS_REMOVE_TOGGLE, token})
export const tokenBalancesNum = (num: number, pages: number) => ({type: TOKENS_BALANCES_NUM, num, pages})
export const fetchTokensStart = () => ({type: TOKENS_FETCH_START})
export const fetchTokensEnd = () => ({type: TOKENS_FETCH_END})

export const listTokens = () => dispatch => {
  dispatch(fetchTokensStart())
  return TokenContractsDAO.getList().then(list => {
    dispatch(fetchTokensEnd())
    dispatch({type: TOKENS_LIST, list})
  })
}

export const listTokenBalances = (token: TokenContractModel, page = 0, address = null) => dispatch => {
  let balances = new Map()
  balances = balances.set('Loading...', null)
  dispatch({type: TOKENS_BALANCES, balances})

  return new Promise(resolve => {
    if (address === null) {
      let perPage = 100
      PlatformDAO.getHoldersCount().then(balancesNum => {
        dispatch(tokenBalancesNum(balancesNum, Math.ceil(balancesNum / perPage)))
        TokenContractsDAO.getBalances(token.symbol(), page * perPage, perPage).then(balances => {
          dispatch({type: TOKENS_BALANCES, balances})
          resolve()
        })
      })
    } else {
      let balances = new Map()
      if (validator.address(address) === null) {
        dispatch(tokenBalancesNum(1, 1))
        token.proxy().then(proxy => {
          proxy.getAccountBalance(address).then(balance => {
            balances = balances.set(address, balance)
            dispatch({type: TOKENS_BALANCES, balances})
            resolve()
          })
        })
      } else {
        dispatch(tokenBalancesNum(0, 0))
        dispatch({type: TOKENS_BALANCES, balances})
        resolve()
      }
    }
  })
}

export const viewToken = (token: TokenContractModel) => dispatch => {
  dispatch(fetchTokensStart())
  return token.proxy().then(proxy => {
    return proxy.totalSupply().then(supply => {
      dispatch(fetchTokensEnd())
      token = token.set('totalSupply', supply)
      dispatch({type: TOKENS_VIEW, token})
      dispatch(showSettingsTokenViewModal())
      dispatch(listTokenBalances(token))
    })
  }, () => {
    dispatch(fetchTokensEnd())
    dispatch(showTokenError(token.address()))
  })
}

export const formToken = (token: TokenContractModel) => dispatch => {
  dispatch({type: TOKENS_FORM, token})
  dispatch(showSettingsTokenModal())
}

export const treatToken = (current: TokenContractModel, newAddress: string) => dispatch => {
  const newToken = new TokenContractModel({address: newAddress})
  dispatch(updateToken(newToken.fetching()))
  if (current.address() !== null) {
    dispatch(removeToken(current))
  }
  const reset = () => {
    dispatch(removeToken(newToken))
    if (current.address() !== null) {
      dispatch(updateToken(current))
    }
  }
  return TokenContractsDAO.treat(current, newAddress).then(result => {
    if (result !== true) { // success result will be watched so we need to process only false
      dispatch(showTokenError(newAddress))
      reset()
    }
  }).catch(() => {
    reset()
  })
}

export const revokeToken = (token: TokenContractModel) => dispatch => {
  dispatch(updateToken(token.fetching()))
  dispatch(removeTokenToggle(null))
  return TokenContractsDAO.remove(token).catch(() => {
    dispatch(updateToken(token))
  })
}

export const watchToken = (token: TokenContractModel, time, isRevoked, isOld) => dispatch => {
  dispatch(notify(new TokenContractNoticeModel({time, token, isRevoked}), isOld))
  if (!isOld) {
    dispatch(isRevoked ? removeToken(token) : updateToken(token))
  }
}

export const watchInitToken = () => dispatch => {
  TokenContractsDAO.watch((token, time, isRevoked, isOld) => dispatch(watchToken(token, time, isRevoked, isOld)))
}
