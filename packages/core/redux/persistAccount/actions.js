/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import Accounts from 'web3-eth-accounts'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
  BLOCKCHAIN_EOS,
  BLOCKCHAIN_LABOR_HOUR,
} from '@chronobank/login/network/constants'

import * as ProfileThunks from '../profile/thunks'
import * as AccountUtils from './utils'
import EthereumMemoryDevice from '../../services/signers/EthereumMemoryDevice'
import { WALLET_TYPE_MEMORY } from '../../models/constants/AccountEntryModel'
import {
  AccountModel,
  AccountEntryModel,
  AccountProfileModel,
  AccountCustomNetwork,
} from '../../models/wallet/persistAccount'

import {
  ADDRESSES_SENT_TO_PROFILE_SERVICE,
  BLOCKCHAIN_LIST_UPDATE,
  CUSTOM_NETWORKS_LIST_ADD,
  CUSTOM_NETWORKS_LIST_RESET,
  CUSTOM_NETWORKS_LIST_UPDATE,
  DUCK_PERSIST_ACCOUNT,
  WALLETS_ADD,
  WALLETS_DESELECT,
  WALLETS_SELECT,
  WALLETS_UPDATE_LIST,
  WALLETS_LOAD,
  WALLETS_CACHE_ADDRESS_CLEAR,
  UPDATE_LAST_NETWORK_ID,
} from './constants'

import { getBlockchainList, getPersistAccount } from './selectors'
import { enableBitcoin, disableBitcoin } from '../bitcoin/thunks'
import { enableEthereum } from '../ethereum/thunks'
import { enableLaborHour, disableLaborHour } from '../laborHour/thunks'
import { enableNem, disableNem } from '../nem/thunks'
import { enableWaves, disableWaves } from '../waves/thunks'
import { enableEos, disableEos } from '../eos/thunks'

const enableMap = {
  [BLOCKCHAIN_BITCOIN]: enableBitcoin(BLOCKCHAIN_BITCOIN),
  [BLOCKCHAIN_BITCOIN_CASH]: enableBitcoin(BLOCKCHAIN_BITCOIN_CASH),
  [BLOCKCHAIN_LITECOIN]: enableBitcoin(BLOCKCHAIN_LITECOIN),
  [BLOCKCHAIN_DASH]: enableBitcoin(BLOCKCHAIN_DASH),
  [BLOCKCHAIN_NEM]: enableNem(),
  [BLOCKCHAIN_WAVES]: enableWaves(),
  [BLOCKCHAIN_EOS]: enableEos(),
  [BLOCKCHAIN_LABOR_HOUR]: enableLaborHour(),
}
const disableMap = {
  [BLOCKCHAIN_BITCOIN]: disableBitcoin(BLOCKCHAIN_BITCOIN),
  [BLOCKCHAIN_BITCOIN_CASH]: disableBitcoin(BLOCKCHAIN_BITCOIN_CASH),
  [BLOCKCHAIN_LITECOIN]: disableBitcoin(BLOCKCHAIN_LITECOIN),
  [BLOCKCHAIN_DASH]: disableBitcoin(BLOCKCHAIN_DASH),
  [BLOCKCHAIN_NEM]: disableNem(),
  [BLOCKCHAIN_WAVES]: disableWaves(),
  [BLOCKCHAIN_EOS]: disableEos(),
  [BLOCKCHAIN_LABOR_HOUR]: disableLaborHour(),
}

export const enableDefaultBlockchains = () => async (dispatch, getState) => {
  const state = getState()
  const activeBlockchains = getBlockchainList(state)

  await dispatch(enableEthereum())
  await dispatch(enableBlockchains(activeBlockchains))
}

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index])
  }
}

const enableBlockchains = (blockchains) => async (dispatch) => {
  await asyncForEach(blockchains, async (blockchain) => {
    try {
      if (!enableMap[blockchain]) {
        return
      }
      await dispatch(enableMap[blockchain])
    } catch (error) {
      //eslint-disable-next-line
      console.error(`${blockchain} Initialization error: `, error)
    }
  })
}

export const disableBlockchains = (blockchains) => (dispatch) => {
  blockchains.forEach((blockchain) => {
    if (!disableMap[blockchain]) {
      return
    }
    dispatch(disableMap[blockchain])
  })
}

/**
 * List of addresses that was sent to the middleware profile service. To avoid this request multiple times
 * @param wallet
 * @returns {Function}
 */
export const sentAddresses = (addressList) => (dispatch) => {
  dispatch({ type: ADDRESSES_SENT_TO_PROFILE_SERVICE, addressList })
}

/**
 * Update last network id. Used for proper address cache usage
 * @param networkData
 * @returns {Function}
 */
export const updateLastNetworkId = (lastNetworkId) => (dispatch) => {
  dispatch({ type: UPDATE_LAST_NETWORK_ID, lastNetworkId })
}

export const accountAdd = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_ADD, wallet })
}

export const accountSelect = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_SELECT, wallet })
}

export const accountDeselect = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_DESELECT, wallet })
}

export const accountLoad = (wallet) => (dispatch) => {
  dispatch({ type: WALLETS_LOAD, wallet })
}

export const accountUpdateList = (walletList) => (dispatch) => {
  dispatch({ type: WALLETS_UPDATE_LIST, walletList })
}

export const accountUpdate = (wallet) => (dispatch, getState) => {
  const state = getState()

  const { walletsList } = state.get(DUCK_PERSIST_ACCOUNT)
  const index = walletsList.findIndex((item) => item.key === wallet.key)
  const copyWalletList = [...walletsList]

  copyWalletList.splice(index, 1, wallet)

  dispatch({ type: WALLETS_UPDATE_LIST, walletsList: copyWalletList })
}

export const updateBlockchainActivity = (blockchainList, enableDisable = false) => async (dispatch, getState) => {
  const state = getState()
  const currentBlockchains = getBlockchainList(state)

  const blockchainToEnable = AccountUtils.formatBlockchainListToArray(blockchainList, (name, isEnabled) => isEnabled && !currentBlockchains.includes(name))
  if (enableDisable && blockchainToEnable) {
    await dispatch(enableBlockchains(blockchainToEnable))

  }

  const blockchainToDisable = AccountUtils.formatBlockchainListToArray(blockchainList, (name, isEnabled) => !isEnabled)
  if (enableDisable && blockchainToDisable) {
    dispatch(disableBlockchains(blockchainToDisable))
  }

  const newBlockchainList = AccountUtils.formatBlockchainListToArray(blockchainList, (name, isEnabled) => isEnabled)
  dispatch(updateBlockchainsList(newBlockchainList))
}

/* eslint-disable-next-line import/prefer-default-export */
export const updateBlockchainsList = (blockchainList) => async (dispatch, getState) => {
  const account = getPersistAccount(getState())
  const walletKey = account.selectedWallet.key

  dispatch({
    type: BLOCKCHAIN_LIST_UPDATE,
    blockchainList,
    walletKey,
  })
}

export const decryptAccount = (entry, password) => async () => {
  const privateKey = EthereumMemoryDevice.decrypt({ entry: entry.encrypted[0].wallet, password })
  const account = new AccountModel({
    entry,
    privateKey,
  })

  return account
}

export const validateAccountName = (name) => (dispatch, getState) => {
  const state = getState()
  const { walletsList } = state.get(DUCK_PERSIST_ACCOUNT)

  return !walletsList.find((item) => item.name === name)
}

export const resetPasswordAccount = (wallet, mnemonic, password) => async (dispatch) => {
  const accounts = new Accounts()
  accounts.wallet.clear()

  const newCopy = await dispatch(createAccount({ name: wallet.name, mnemonic, password }))
  const newWallet = {
    ...wallet,
    encrypted: newCopy.encrypted,
  }

  dispatch(accountUpdate(newWallet))
  dispatch(accountSelect(newWallet))
}

export const createAccount = ({ name, wallet, type }) => async (dispatch) => {
  const entry = new AccountEntryModel({
    key: uuid(),
    name,
    type,
    encrypted: [wallet],
    profile: null,
  })

  const newAccounts = await dispatch(setProfilesForAccounts([entry]))

  return newAccounts[0] || entry
}

export const createMemoryAccount = ({ name, password, mnemonic, privateKey }) => async (dispatch) => {
  const wallet = await EthereumMemoryDevice.create({ privateKey, mnemonic, password })
  const account = await dispatch(createAccount({
    name,
    wallet,
    type: WALLET_TYPE_MEMORY,
  }))
  return account
}

export const downloadWallet = () => (dispatch, getState) => {
  const state = getState()
  const { selectedWallet } = state.get(DUCK_PERSIST_ACCOUNT)

  if (selectedWallet) {
    const walletName = selectedWallet.name || 'Wallet'
    const text = JSON.stringify(selectedWallet.encrypted.length > 1 ? selectedWallet.encrypted : selectedWallet.encrypted[0].wallet)
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', `${walletName}.wlt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
}

export const setProfilesForAccounts = (walletsList) => async (dispatch) => {

  const addresses = AccountUtils.getWalletsListAddresses(walletsList)
  const data = await dispatch(ProfileThunks.getUserInfo(addresses))

  if (Array.isArray(data)) {
    return data.reduce((prev, profile) => {

      const updatedProfileAccounts =
        walletsList
          .filter((wallet) => AccountUtils.getAccountAddress(wallet, true) === profile.address)
          .map((account) => {
            const profileModel = profile && new AccountProfileModel(profile) || null
            return new AccountEntryModel({
              ...account,
              profile: profileModel,
            })
          })

      return [].concat(prev, updatedProfileAccounts)
    }, [])
  } else {
    return walletsList
  }
}

export const logout = () => (dispatch) => {
  dispatch(accountSelect(null))
  dispatch(accountLoad(null))
}

export const customNetworkCreate = (url, ws, alias) => (dispatch) => {
  const network = new AccountCustomNetwork({
    id: uuid(),
    name: alias,
    url,
    ws,
  })

  dispatch(customNetworksListAdd(network))
}

export const customNetworkEdit = (network: AccountCustomNetwork) => (dispatch, getState) => {
  const state = getState()

  const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
  const foundNetworkIndex = customNetworksList.findIndex((item) => network.id === item.id)

  if (foundNetworkIndex !== -1) {
    const copyNetworksList = [...customNetworksList]
    copyNetworksList.splice(foundNetworkIndex, 1, network)
    dispatch(customNetworksListUpdate(copyNetworksList))
  }
}

export const customNetworksListAdd = (network: AccountCustomNetwork) => (dispatch) => {
  dispatch({ type: CUSTOM_NETWORKS_LIST_ADD, network })
}

export const customNetworksDelete = (network) => (dispatch, getState) => {
  const state = getState()
  const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
  const updatedNetworkList = customNetworksList.filter((item) => item.id !== network.id)

  dispatch(customNetworksListUpdate(updatedNetworkList))
}

export const customNetworksListUpdate = (list) => (dispatch) => {
  dispatch({ type: CUSTOM_NETWORKS_LIST_UPDATE, list })
}

export const customNetworksListReset = () => (dispatch) => {
  dispatch({ type: CUSTOM_NETWORKS_LIST_RESET })
}

export const clearWalletsAddressCache = () => (dispatch) => {
  dispatch({ type: WALLETS_CACHE_ADDRESS_CLEAR })
}
