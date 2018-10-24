/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { isNil, omitBy } from 'lodash'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/login/network/constants'
import { TxEntryModel, HolderModel, ContractDAOModel, ContractModel } from '../../models'
import EthereumMemoryDevice from '../../services/signers/EthereumMemoryDevice'
import { ethereumPendingSelector, pendingEntrySelector, web3Selector } from './selectors'
import { DUCK_ETHEREUM } from './constants'
import { getEthereumSigner, getAddressCache } from '../persistAccount/selectors'
import ethereumDAO from '../../dao/EthereumDAO'
import { modalsOpen } from '../modals/actions'
import { describePendingTx } from '../../describers'
import { daoByAddress, daoByType } from '../daos/selectors'
import { getAccount } from '../session/selectors/models'
import { DUCK_PERSIST_ACCOUNT,
  WALLETS_CACHE_ADDRESS,
} from '../persistAccount/constants'
import * as ethActions from './actions'
import * as Utils from './utils'
import { showSignerModal, closeSignerModal } from '../modals/thunks'
import { formatBalances, getWalletBalances } from '../tokens/utils'
import WalletModel from '../../models/wallet/WalletModel'
import { WALLETS_SET } from '../wallets/constants'

import { DUCK_TOKENS } from '../tokens/constants'
import * as TokensActions from '../tokens/actions'
import tokenService from '../../services/TokenService'
import { DAOS_REGISTER } from '../daos/constants'
import ERC20ManagerDAO from '../../dao/ERC20ManagerDAO'
import TokenModel from '../../models/tokens/TokenModel'
import { EVENT_ERC20_TOKENS_COUNT, EVENT_NEW_ERC20_TOKEN } from '../../dao/constants/ERC20ManagerDAO'

export const initEthereum = ({ web3 }) => (dispatch) => {
  dispatch(ethActions.ethWeb3Update(new HolderModel({ value: web3 })))
}

const ethTxStatus = (key, address, props) => (dispatch, getState) => {
  const pending = ethereumPendingSelector()(getState())
  const scope = pending[address]
  if (!scope) {
    return null
  }
  const entry = scope[key]
  if (!entry) {
    return null
  }
  return dispatch(ethActions.ethTxUpdate(
    key,
    address,
    new TxEntryModel({
      ...entry,
      ...props,
    }),
  ))
}

export const nextNonce = ({ web3, address }) => async (dispatch, getState) => {
  // eslint-disable-next-line no-param-reassign
  address = address.toLowerCase()
  const state = getState().get(DUCK_ETHEREUM)
  return Math.max(
    (address in state.nonces)
      ? state.nonces[address]
      : 0,
    await web3.eth.getTransactionCount(address, 'pending'),
  )
}

export const executeTransaction = ({ tx, options }) => async (dispatch, getState) => {
  const web3 = web3Selector()(getState())
  const prepared = await dispatch(prepareTransaction({ web3, tx, options }))
  const entry = Utils.createEthTxEntryModel(prepared, options)

  await dispatch(ethActions.ethTxCreate(entry))
  dispatch(submitTransaction(entry))
}

export const prepareTransaction = ({ web3, tx, options }) => async (dispatch) => {
  const { feeMultiplier } = options || {}
  const nonce = await dispatch(nextNonce({ web3, address: tx.from }))
  const gasPrice = new BigNumber(await web3.eth.getGasPrice()).mul(feeMultiplier || 1)
  const chainId = await web3.eth.net.getId()
  const gasLimit = await Utils.estimateEthTxGas(web3, tx, gasPrice, nonce, chainId)
  return Utils.createEthTxExecModel(tx, gasLimit, gasPrice, nonce, chainId)
}

export const processTransaction = ({ web3, entry, signer }) => async (dispatch, getState) => {
  await dispatch(signTransaction({ entry, signer }))
  return dispatch(sendSignedTransaction({
    web3,
    entry: pendingEntrySelector(entry.tx.from, entry.key)(getState()),
  }))
}

export const signTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  try {
    const { selectedWallet } = getState().get(DUCK_PERSIST_ACCOUNT)

    dispatch(showSignerModal())
    const signed = await signer.signTransaction(omitBy(entry.tx, isNil), selectedWallet.encrypted[0].path)
    dispatch(closeSignerModal())

    const raw = signed.rawTransaction
    dispatch(ethTxStatus(entry.key, entry.tx.from, { isSigned: true, raw }))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('signTransaction error: ', error)
    dispatch(closeSignerModal())
    dispatch(ethTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
    throw error
  }
}

export const sendSignedTransaction = ({ web3, entry }) => async (dispatch, getState) => {
  dispatch(ethTxStatus(entry.key, entry.tx.from, { isPending: true }))

  // eslint-disable-next-line
  entry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
  dispatch(ethActions.ethNonceUpdate(entry.tx.from, entry.tx.nonce))

  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(entry.raw)
      .on('transactionHash', (hash) => {
        dispatch(ethTxStatus(entry.key, entry.tx.from, { isSent: true, hash }))
      })
      .on('receipt', (receipt) => {
        dispatch(ethTxStatus(entry.key, entry.tx.from, { isMined: true, receipt }))
        resolve(receipt)
      })
      .on('error', (error) => {
        dispatch(ethTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
        reject(error)
      })
  })
}

const submitTransaction = (entry) => async (dispatch, getState) => {

  const state = getState()
  const account = getAccount(state)
  const dao = daoByAddress(entry.tx.to)(state) || ethereumDAO

  const description = describePendingTx(entry, {
    address: account,
    abi: dao.abi,
    token: dao.token,
  })

  dispatch(modalsOpen({
    componentName: 'ConfirmTxDialog',
    props: {
      entry,
      description,
      accept: acceptTransaction,
      reject: () => dispatch(ethTxStatus(entry.key, entry.tx.from, { isRejected: true })),
    },
  }))
}

const acceptTransaction = (entry) => async (dispatch, getState) => {
  dispatch(ethTxStatus(entry.key, entry.tx.from, { isAccepted: true, isPending: true }))

  const state = getState()
  let signer = getEthereumSigner(state)
  if (entry.walletDerivedPath) {
    signer = await EthereumMemoryDevice.getDerivedWallet(signer.privateKey, entry.walletDerivedPath)
  }

  return dispatch(processTransaction({
    web3: web3Selector()(state),
    entry: pendingEntrySelector(entry.tx.from, entry.key)(state),
    signer,
  }))
}

export const estimateGas = (tx, feeMultiplier = 1) => async (dispatch, getState) => {

  const web3 = web3Selector()(getState())
  const nonce = await dispatch(nextNonce({ web3, address: tx.from }))
  const gasPrice = new BigNumber(await web3.eth.getGasPrice()).mul(feeMultiplier)
  const chainId = await web3.eth.net.getId()
  const gasLimit = await Utils.estimateEthTxGas(web3, tx, gasPrice, nonce, chainId)
  const gasFee = gasPrice.mul(gasLimit)

  return {
    gasLimit,
    gasFee,
    gasPrice,
  }
}

export const updateWalletBalance = (wallet) => (dispatch) => {
  getWalletBalances({ wallet })
    .then((balancesResult) => {
      try {
        dispatch({ type: WALLETS_SET, wallet: new WalletModel({
          ...wallet,
          balances: {
            ...wallet.balances,
            ...formatBalances(BLOCKCHAIN_ETHEREUM, balancesResult),
          },
        }),
        })
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

export const enableEthereum = () => async (dispatch) => {
  dispatch(initToken())
  dispatch(initWalletFromKeys())
}

const initToken = () => async (dispatch, getState) => {
  let state = getState()
  if (state.get(DUCK_TOKENS).isInited()) {
    return
  }
  const web3 = web3Selector()(state)
  ethereumDAO.connect(web3)

  dispatch(TokensActions.tokensInit())
  dispatch(TokensActions.setTokensFetchingCount(0))
  const erc20: ERC20ManagerDAO = daoByType('ERC20Manager')(state)

  state = getState()
  erc20
    .on(EVENT_ERC20_TOKENS_COUNT, async () => {
      // eth
      const eth: TokenModel = await ethereumDAO.getToken()
      if (eth) {
        dispatch(TokensActions.tokenFetched(eth))
        tokenService.registerDAO(eth, ethereumDAO)
      }
    })
    .on(EVENT_NEW_ERC20_TOKEN, (token: TokenModel) => {
      dispatch(TokensActions.tokenFetched(token))
      const dao = tokenService.createDAO(token, web3)

      dispatch({
        type: DAOS_REGISTER,
        model: new ContractDAOModel({
          contract: new ContractModel({
            abi: dao.abi,
            type: token.symbol(),
          }),
          address: token.address(),
          dao,
        }),
      })
    })
    .fetchTokens()
}

const initWalletFromKeys = () => async (dispatch, getState) => {
  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const addressCache = { ...getAddressCache(state) }

  if (!addressCache[BLOCKCHAIN_ETHEREUM]) {
    const path = Utils.getEthereumDerivedPath(network[BLOCKCHAIN_ETHEREUM])
    const signer = getEthereumSigner(state)
    if (signer) {
      const address = await signer.getAddress(path)
      addressCache[BLOCKCHAIN_ETHEREUM] = {
        address,
        path,
      }

      dispatch({
        type: WALLETS_CACHE_ADDRESS,
        blockchain: BLOCKCHAIN_ETHEREUM,
        address,
        path,
      })
    }
  }

  const { address, path } = addressCache[BLOCKCHAIN_ETHEREUM]
  const wallet = new WalletModel({
    address,
    blockchain: BLOCKCHAIN_ETHEREUM,
    isMain: true,
    walletDerivedPath: path,
  })

  ethereumProvider.subscribe(wallet.address)
  dispatch({ type: WALLETS_SET, wallet })

  dispatch(updateWalletBalance(wallet))
}
