import { Map } from 'immutable'
import { showSettingsOtherContractModal, showSettingsOtherContractModifyModal } from '../ui/modal'
import OtherContractsDAO from '../../dao/OtherContractsDAO'
import AbstractOtherContractModel from '../../models/contracts/AbstractOtherContractModel'
import DefaultContractModel from '../../models/contracts/RewardsContractModel' // any child of AbstractOtherContractModel
import OtherContractNoticeModel from '../../models/notices/OtherContractNoticeModel'
import { notify } from '../notifier/notifier'

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
  isFetched: false,
  isFetching: false,
  isRemove: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case OTHER_CONTRACTS_LIST:
      return {
        ...state,
        list: action.list,
        isFetched: true
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

const updateContract = (contract: AbstractOtherContractModel) => ({type: OTHER_CONTRACTS_UPDATE, contract})
const removeContract = (contract: AbstractOtherContractModel) => ({type: OTHER_CONTRACTS_REMOVE, contract})
export const showContractForm = (contract: AbstractOtherContractModel) => ({type: OTHER_CONTRACTS_FORM, contract})
export const showContractError = (address: string) => ({type: OTHER_CONTRACTS_ERROR, address})
export const hideContractError = () => ({type: OTHER_CONTRACTS_HIDE_ERROR})
export const removeContractToggle = (contract: AbstractOtherContractModel = null) => ({
  type: OTHER_CONTRACTS_REMOVE_TOGGLE,
  contract
})
export const fetchContractsStart = () => ({type: OTHER_CONTRACTS_FETCH_START})
export const fetchContractsEnd = () => ({type: OTHER_CONTRACTS_FETCH_END})

export const listContracts = () => dispatch => {
  dispatch(fetchContractsStart())
  return OtherContractsDAO.getList().then(list => {
    dispatch(fetchContractsEnd())
    dispatch({type: OTHER_CONTRACTS_LIST, list})
  })
}

export const formContract = (contract: AbstractOtherContractModel) => dispatch => {
  dispatch(showContractForm(contract))
  dispatch(showSettingsOtherContractModal())
}

export const formModifyContract = (contract: AbstractOtherContractModel) => dispatch => {
  dispatch(fetchContractsStart())
  return contract.dao().then(dao => {
    return dao.retrieveSettings().then(settings => {
      dispatch(fetchContractsEnd())
      dispatch(showContractForm(contract.set('settings', settings)))
      dispatch(showSettingsOtherContractModifyModal())
    })
  })
}

export const addContract = (address: string) => dispatch => {
  const contract = new DefaultContractModel(address)
  dispatch(updateContract(contract.fetching(true)))
  return OtherContractsDAO.add(address).then(result => {
    if (!result) { // success result will be watched so we need to process only false
      dispatch(removeContract(contract))
      dispatch(showContractError(address))
    }
  }).catch(() => {
    dispatch(removeContract(contract))
  })
}

export const saveContractSettings = (contract: AbstractOtherContractModel) => dispatch => {
  dispatch(updateContract(contract.fetching()))
  return contract.dao().then(dao => {
    return dao.saveSettings(contract).then(result => {
      dispatch(updateContract(contract))
      if (!result) {
        dispatch(showContractError(contract.address()))
      }
    }).catch(() => {
      dispatch(updateContract(contract))
    })
  })
}

export const revokeContract = (contract: AbstractOtherContractModel) => dispatch => {
  dispatch(updateContract(contract.fetching()))
  dispatch(removeContractToggle(null))
  return OtherContractsDAO.remove(contract).catch(() => {
    dispatch(updateContract(contract))
  })
}

export const watchContract = (contract: AbstractOtherContractModel, time, isRevoked, isOld) => dispatch => {
  dispatch(notify(new OtherContractNoticeModel({time, contract, isRevoked}), isOld))
  if (!isOld) {
    dispatch(isRevoked ? removeContract(contract) : updateContract(contract))
  }
}

export const watchInitContract = () => dispatch => {
  // OtherContractsDAO.watchUpdate((contract, time, isRevoked, isOld) =>
  //  dispatch(watchContract(contract, time, isRevoked, isOld)))
}
