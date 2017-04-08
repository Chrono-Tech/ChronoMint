import {Map} from 'immutable'
import {showSettingsOtherContractModal, showSettingsOtherContractModifyModal} from '../ui/modal'
import OtherContractsDAO from '../../dao/OtherContractsDAO'
import AbstractOtherContractModel from '../../models/contracts/AbstractOtherContractModel'
import DefaultContractModel from '../../models/contracts/RewardsContractModel' // any child of AbstractOtherContractModel
import OtherContractNoticeModel from '../../models/notices/OtherContractNoticeModel'
import {notify} from '../notifier/notifier'

export const OTHER_CONTRACTS_LIST = 'settings/OTHER_CONTRACTS_LIST'
export const OTHER_CONTRACTS_FORM = 'settings/OTHER_CONTRACTS_FORM'
export const OTHER_CONTRACTS_UPDATE = 'settings/OTHER_CONTRACTS_UPDATE'
export const OTHER_CONTRACTS_REMOVE = 'settings/OTHER_CONTRACTS_REMOVE'
export const OTHER_CONTRACTS_REMOVE_TOGGLE = 'settings/OTHER_CONTRACTS_REMOVE_TOGGLE'
export const OTHER_CONTRACTS_ERROR = 'settings/OTHER_CONTRACTS_ERROR' // all - add & modify & remove
export const OTHER_CONTRACTS_HIDE_ERROR = 'settings/OTHER_CONTRACTS_HIDE_ERROR'
export const OTHER_CONTRACTS_FETCH_START = 'settings/OTHER_CONTRACTS_FETCH_START'
export const OTHER_CONTRACTS_FETCH_END = 'settings/OTHER_CONTRACTS_FETCH_END'

const initialState = {
  list: new Map(),
  selected: new DefaultContractModel(),
  error: false,
  isReady: false,
  isFetching: false,
  isRemove: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case OTHER_CONTRACTS_LIST:
      return {
        ...state,
        list: action.list,
        isReady: true
      }
    case OTHER_CONTRACTS_FORM:
      return {
        ...state,
        selected: action.contract
      }
    case OTHER_CONTRACTS_UPDATE:
      return {
        ...state,
        list: state.list.set(action.contract.address(), action.contract)
      }
    case OTHER_CONTRACTS_REMOVE:
      return {
        ...state,
        list: state.list.delete(action.contract.address())
      }
    case OTHER_CONTRACTS_REMOVE_TOGGLE:
      return {
        ...state,
        selected: action.contract === null ? new DefaultContractModel() : action.contract,
        isRemove: action.contract !== null
      }
    case OTHER_CONTRACTS_ERROR:
      return {
        ...state,
        error: action.address
      }
    case OTHER_CONTRACTS_HIDE_ERROR:
      return {
        ...state,
        error: false
      }
    case OTHER_CONTRACTS_FETCH_START:
      return {
        ...state,
        isFetching: true
      }
    case OTHER_CONTRACTS_FETCH_END:
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}

const showContractForm = (contract: AbstractOtherContractModel) => ({type: OTHER_CONTRACTS_FORM, contract})
const showContractError = (address: string) => ({type: OTHER_CONTRACTS_ERROR, address})
const hideContractError = () => ({type: OTHER_CONTRACTS_HIDE_ERROR})
const removeContractToggle = (contract: AbstractOtherContractModel = null) => ({
  type: OTHER_CONTRACTS_REMOVE_TOGGLE,
  contract
})
const fetchContractsStart = () => ({type: OTHER_CONTRACTS_FETCH_START})
const fetchContractsEnd = () => ({type: OTHER_CONTRACTS_FETCH_END})

const listContracts = () => dispatch => {
  dispatch(fetchContractsStart())
  return OtherContractsDAO.getList().then(list => {
    dispatch(fetchContractsEnd())
    dispatch({type: OTHER_CONTRACTS_LIST, list})
  })
}

const formContract = (contract: AbstractOtherContractModel) => dispatch => {
  dispatch(showContractForm(contract))
  dispatch(showSettingsOtherContractModal())
}

const formModifyContract = (contract: AbstractOtherContractModel) => dispatch => {
  dispatch(fetchContractsStart())
  return contract.dao().then(dao => {
    return dao.retrieveSettings().then(settings => {
      dispatch(fetchContractsEnd())
      dispatch(showContractForm(contract.set('settings', settings)))
      dispatch(showSettingsOtherContractModifyModal())
    })
  })
}

const addContract = (address: string, account) => dispatch => {
  dispatch(fetchContractsStart())
  return OtherContractsDAO.add(address, account).then(result => {
    dispatch(fetchContractsEnd())
    if (!result) { // success result will be watched so we need to process only false
      dispatch(showContractError(address))
    }
  })
}

const saveContractSettings = (contract: AbstractOtherContractModel, account) => dispatch => {
  dispatch(fetchContractsStart())
  return contract.dao().then(dao => {
    return dao.saveSettings(contract, account).then(result => {
      dispatch(fetchContractsEnd())
      if (!result) {
        dispatch(showContractError(contract.address()))
      }
    })
  })
}

const removeContract = (contract: AbstractOtherContractModel, account) => dispatch => {
  dispatch(fetchContractsStart())
  dispatch(removeContractToggle(null))
  return OtherContractsDAO.remove(contract, account).then(r => {
    dispatch(fetchContractsEnd())
    if (!r) { // success result will be watched so we need to process only false
      dispatch(showContractError(contract.address()))
    }
  })
}

const watchContract = (contract: AbstractOtherContractModel, time, isRevoked, isOld) => dispatch => {
  dispatch(notify(new OtherContractNoticeModel({time, contract, isRevoked}), isOld))
  if (!isOld) {
    dispatch({type: isRevoked ? OTHER_CONTRACTS_REMOVE : OTHER_CONTRACTS_UPDATE, contract})
  }
}

const watchInitContract = account => dispatch => {
  OtherContractsDAO.watch((contract, time, isRevoked, isOld) =>
    dispatch(watchContract(contract, time, isRevoked, isOld)))
}

export {
  listContracts,
  formContract,
  formModifyContract,
  addContract,
  saveContractSettings,
  removeContractToggle,
  removeContract,
  showContractForm,
  showContractError,
  hideContractError,
  watchContract,
  watchInitContract,
  fetchContractsStart,
  fetchContractsEnd
}

export default reducer
