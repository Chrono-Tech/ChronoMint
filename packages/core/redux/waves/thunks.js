/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { BLOCKCHAIN_WAVES } from '@chronobank/login/network/constants'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import { wavesProvider } from '@chronobank/login/network/WavesProvider'
import { getWalletsByBlockchain } from '../wallets/selectors/models'

import * as WavesUtils from './utils'
import * as WavesActions from './actions'
import { getToken } from '../tokens/selectors'
import { modalsOpen } from '../modals/actions'
import { getWavesSigner, pendingEntrySelector } from './selectors'
import { describePendingWavesTx } from '../../describers'
import { getSelectedNetwork, getAddressCache } from '../persistAccount/selectors'
import TxExecModel from '../../models/TxExecModel'
import { DUCK_TOKENS } from '../tokens/constants'
import tokenService from '../../services/TokenService'
import {
  DUCK_PERSIST_ACCOUNT,
  WALLETS_CACHE_ADDRESS,
} from '../persistAccount/constants'
import { showSignerModal, closeSignerModal } from '../modals/thunks'
import { formatBalances, getWalletBalances } from '../tokens/utils'
import WalletModel from '../../models/wallet/WalletModel'

import * as TokensActions from '../tokens/actions'
import { WAVES_DECIMALS, WAVES_WAVES_NAME, WAVES_WAVES_SYMBOL } from '../../dao/constants/WavesDAO'
import WavesDAO from '../../dao/WavesDAO'
import TokenModel from '../../models/tokens/TokenModel'
import { WALLETS_SET, WALLETS_UNSET } from '../wallets/constants'

export const executeWavesTransaction = ({ tx, options }) => async (dispatch, getState) => {
  const state = getState()
  const token = getToken(options.symbol)(state)
  const network = getSelectedNetwork()(state)
  const prepared = dispatch(WavesUtils.prepareWavesTransaction(tx, token, network))
  const entry = WavesUtils.createWavesTxEntryModel({ tx: prepared }, options)

  await dispatch(WavesActions.wavesTxCreate(entry))
  dispatch(submitTransaction(entry))
}

const submitTransaction = (entry) => async (dispatch, getState) => {
  const state = getState()
  const description = describePendingWavesTx(entry, {
    token: getToken(entry.symbol)(state),
  })

  dispatch(modalsOpen({
    componentName: 'ConfirmTxDialog',
    props: {
      entry,
      description,
      accept: acceptTransaction,
      reject: (entry) => (dispatch) => dispatch(WavesActions.wavesTxReject(entry)),
    },
  }))
}

const acceptTransaction = (entry) => async (dispatch, getState) => {
  dispatch(WavesActions.wavesTxAccept(entry))

  const state = getState()
  const signer = getWavesSigner(state)

  const selectedEntry = pendingEntrySelector(entry.tx.from, entry.key)(state)
  if (!selectedEntry) {
    // eslint-disable-next-line no-console
    console.error('entry is null', entry)
    return // stop execute
  }

  try {
    return dispatch(processTransaction({
      entry: selectedEntry,
      signer,
    }))
  } catch (error) {
    throw error
  }
}

const processTransaction = ({ entry, signer }) => async (dispatch) => {
  try {
    dispatch(WavesActions.wavesTxProcessTransaction({ entry, signer }))
    const signedEntry = await dispatch(signTransaction({ entry, signer }))
    if (!signedEntry) {
      // eslint-disable-next-line no-console
      console.error('signedEntry is null', entry)
      return null
    }

    return dispatch(sendSignedTransaction(signedEntry))
  } catch (error) {
    throw error
  }
}

const signTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  try {
    const { selectedWallet } = getState().get(DUCK_PERSIST_ACCOUNT)
    dispatch(WavesActions.wavesTxSignTransaction({ entry, signer }))

    dispatch(showSignerModal())
    const signedPreparedTx = await signer.signTransaction(entry.tx.prepared, selectedWallet.encrypted[0].path)
    dispatch(closeSignerModal())

    const newEntry = WavesUtils.createWavesTxEntryModel({ ...entry, tx: new TxExecModel({
      ...entry.tx,
      prepared: signedPreparedTx,
    }),
    })

    return newEntry
  } catch (error) {
    dispatch(closeSignerModal())

    dispatch(WavesActions.wavesTxSignTransactionError({ error }))
    throw error
  }
}

// TODO: need to continue rework of this method. Pushed to merge with other changes.
const sendSignedTransaction = (entry) => async (dispatch, getState) => {
  if (!entry) {
    const error = new Error('Can\'t send empty Tx. There is no entry at WAVES sendSignedTransaction')
    throw new Error(error)
  }

  dispatch(WavesActions.wavesTxSendSignedTransaction(entry))

  const state = getState()
  const token = state.get(DUCK_TOKENS).item(entry.symbol)
  const dao = tokenService.getDAO(token)

  try {
    const result = await dao._wavesProvider.justTransfer(entry.from, entry.tx.prepared)
    return result
  } catch (error) {
    //eslint-disable-next-line
    console.log('Send WAVES errors: ', error)
    dispatch(WavesActions.wavesTxSendSignedTransactionError(error))
  }
}

export const updateWalletBalance = (wallet) => (dispatch) => {
  getWalletBalances({ wallet })
    .then((balancesResult) => {
      try {
        const newWallet = new WalletModel({
          ...wallet,
          balances: {
            ...wallet.balances,
            ...formatBalances(BLOCKCHAIN_WAVES, balancesResult),
          },
        })

        wavesProvider.subscribe(wallet.address)
        dispatch({ type: WALLETS_SET, newWallet })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e.message)
      }
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.log('call balances from middleware is failed getWalletBalances', e)
    })
}

export const enableWaves = () => async (dispatch) => {
  dispatch(initToken())
  dispatch(initWalletFromKeys())
}

const initToken = () => async (dispatch) => {

  const dao = new WavesDAO(WAVES_WAVES_NAME, WAVES_WAVES_SYMBOL, wavesProvider, WAVES_DECIMALS, 'WAVES')
  dao.watch()

  const waves = await dao.fetchToken()
  tokenService.registerDAO(waves, dao)
  dispatch(TokensActions.tokenFetched(waves))
  dispatch(initWavesAssetTokens(waves))
}

export const initWavesAssetTokens = (waves: TokenModel) => async (dispatch) => {
  const assets = await wavesProvider.getAssets()
  // do not wait until initialized, it is ok to lazy load all the tokens
  return Promise.all(
    Object.keys(assets)
      .map((m) => new WavesDAO(m, m, wavesProvider, assets[m]['decimals'], assets[m]['id'], waves))
      .map(async (dao) => {
        try {
          const token = await dao.fetchToken()
          tokenService.registerDAO(token, dao)
          dispatch(TokensActions.tokenFetched(token))
        } catch (e) {
          dispatch(TokensActions.tokensLoadingFailed())
        }
      }),
  )
}

const initWalletFromKeys = () => async (dispatch, getState) => {
  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const addressCache = { ...getAddressCache(state) }

  if (!addressCache[BLOCKCHAIN_WAVES]) {
    const path = WavesUtils.getWavesDerivedPath(network[BLOCKCHAIN_WAVES])
    const signer = getWavesSigner(state)

    if (signer) {
      const address = await signer.getAddress(path)
      addressCache[BLOCKCHAIN_WAVES] = {
        address,
        path,
      }

      dispatch({
        type: WALLETS_CACHE_ADDRESS,
        blockchain: BLOCKCHAIN_WAVES,
        address,
        path,
      })
    }
  }

  const { address, path } = addressCache[BLOCKCHAIN_WAVES]
  const wallet = new WalletModel({
    address,
    blockchain: BLOCKCHAIN_WAVES,
    isMain: true,
    walletDerivedPath: path,
  })

  wavesProvider.subscribe(wallet.address)
  dispatch({ type: WALLETS_SET, wallet })
  dispatch(updateWalletBalance(wallet))
}

export const disableWaves = () => async (dispatch, getState) => {
  const wallets = getWalletsByBlockchain(BLOCKCHAIN_WAVES)(getState())

  wallets.forEach((wallet) => {
    wavesProvider.unsubscribe(wallet.address)
    dispatch({ type: WALLETS_UNSET, wallet })
  })
}

