/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_LITECOIN,
  COIN_TYPE_BCC_MAINNET,
  COIN_TYPE_DASH_MAINNET,
  COIN_TYPE_LTC_MAINNET,
} from '@chronobank/login/network/constants'
import type { Dispatch } from 'redux'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'

import { modalsOpen } from '../modals/actions'
import { WALLETS_CACHE_ADDRESS } from '../persistAccount/constants'
import { getBalanceDataParser } from './converter'
import {
  TransferNoticeModel,
} from '../../models'
import * as BitcoinActions from './actions'
import * as BitcoinUtils from './utils'
import { getSelectedNetwork, getAddressCache } from '../persistAccount/selectors'
import { showSignerModal, closeSignerModal } from '../modals/thunks'

import { describePendingBitcoinTx } from '../../describers'
import { getToken } from '../tokens/selectors'
import { notify, notifyError } from '../notifier/actions'
import BitcoinMiddlewareService from './BitcoinMiddlewareService'

import { getAddressUTXOS } from '../abstractBitcoin/thunks'
import { formatBalances, getProviderByBlockchain } from '../tokens/utils'
import { pendingEntrySelector, getBitcoinCashSigner, getBitcoinSigner, getLitecoinSigner } from './selectors'
import WalletModel from '../../models/wallet/WalletModel'
import * as TokensActions from '../tokens/actions'
import { bitcoinCashDAO, bitcoinDAO, dashDAO, litecoinDAO } from '../../dao/BitcoinDAO'
import { WALLETS_SET, WALLETS_UNSET } from '../wallets/constants'
import { DUCK_TOKENS } from '../tokens/constants'
import tokenService from '../../services/TokenService'
import { getDashSigner } from '../dash/selectors'
import { EVENT_UPDATE_LAST_BLOCK } from '../../dao/constants'
import { getWalletsByBlockchain } from '../wallets/selectors/models'

const daoMap = {
  [BLOCKCHAIN_BITCOIN]: bitcoinDAO,
  [BLOCKCHAIN_BITCOIN_CASH]: bitcoinCashDAO,
  [BLOCKCHAIN_DASH]: dashDAO,
  [BLOCKCHAIN_LITECOIN]: litecoinDAO,
}

export { getAddressUTXOS } from '../abstractBitcoin/thunks'

/**
 * Start sending transaction. It will be signed and sent.
 * @param {tx} - Object {from, to, value}
 * @param {options} - Object {feeMultiplier, walletDerivedPath, symbol, advancedParams}
 *   advancedParams is Object {satPerByte, mode}
 *   mode is 'advanced'|'simple' (manual or automatic fee)
 * @return {undefined}
 */
export const executeBitcoinTransaction = ({ tx, options = {} }) => async (dispatch, getState) => {
  dispatch(BitcoinActions.bitcoinExecuteTx())
  try {
    const state = getState()
    const token = getToken(options.symbol)(state)
    const blockchain = token.blockchain()
    const network = getSelectedNetwork()(state)
    const utxos = await dispatch(getAddressUTXOS(tx.from, blockchain))
    const prepared = await dispatch(BitcoinUtils.prepareBitcoinTransaction(tx, token, network, utxos))
    const entry = BitcoinUtils.createBitcoinTxEntryModel({
      tx: prepared,
      blockchain,
    }, options)
    dispatch(BitcoinActions.bitcoinTxUpdate(entry))
    dispatch(submitTransaction(entry))
  } catch (error) {
    dispatch(BitcoinActions.bitcoinExecuteTxFailure(error))
  }
}

// TODO: dispatch(setLatestBlock(blockchain, { blockNumber: data.currentBlock }))
// in appropriate place
export const getCurrentBlockHeight = (blockchain: string) => (dispatch: Dispatch<any>, getState): Promise<*> => {
  if (!blockchain) {
    const error = new Error('Malformed request. "blockchain" must be non-empty string')
    dispatch(BitcoinActions.bitcoinHttpGetBlocksHeightFailure(error))
    return Promise.reject(error)
  }

  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const netType = network[blockchain]

  dispatch(BitcoinActions.bitcoinHttpGetBlocksHeight())
  return BitcoinMiddlewareService.requestCurrentBlockHeight({ blockchain, type: netType })
    .then((response) => {
      dispatch(BitcoinActions.bitcoinHttpGetBlocksHeightSuccess(response.data))
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(BitcoinActions.bitcoinHttpGetBlocksHeightFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}

export const getTransactionInfo = (txid: string, blockchain: string) => (dispatch: Dispatch<any>, getState): Promise<*> => {
  if (!blockchain || !txid) {
    const error = new Error('Malformed request. "blockchain" and "txid" must be non-empty string')
    dispatch(BitcoinActions.bitcoinHttpGetTransactionInfoFailure(error))
    return Promise.reject(error)
  }

  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const netType = network[blockchain]

  dispatch(BitcoinActions.bitcoinHttpGetTransactionInfo())
  return BitcoinMiddlewareService.requestBitcoinTransactionInfo({ blockchain, type: netType })
    .then((response) => {
      dispatch(BitcoinActions.bitcoinHttpGetTransactionInfoSuccess(response.data))
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(BitcoinActions.bitcoinHttpGetTransactionInfoFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}

export const getTransactionsList = (address: string, id, skip = 0, offset = 0, blockchain: string) => (dispatch: Dispatch<any>, getState): Promise<*> => {
  if (!blockchain || !address || !id) {
    const error = new Error('Malformed request. blockchain and/or address must be non-empty strings')
    dispatch(BitcoinActions.bitcoinHttpGetTransactionListFailure(error))
    return Promise.reject(error)
  }

  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const networkType = network[blockchain]

  dispatch(BitcoinActions.bitcoinHttpGetTransactionList())
  return BitcoinMiddlewareService.requestBitcoinTransactionsList(address, id, skip, offset, blockchain, networkType)
    .then((response) => {
      dispatch(BitcoinActions.bitcoinHttpGetTransactionListSuccess(response.data))
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(BitcoinActions.bitcoinHttpGetTransactionListFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}

export const getAddressInfo = (address: string, blockchain: string) => (dispatch: Dispatch<any>, getState): Promise<*> => {
  if (!blockchain || !address) {
    const error = new Error('Malformed request. blockchain and/or address must be non-empty strings')
    dispatch(BitcoinActions.bitcoinHttpGetAddressInfoFailure(error))
    return Promise.reject(error)
  }

  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const netType = network[blockchain]

  dispatch(BitcoinActions.bitcoinHttpGetAddressInfo())
  return BitcoinMiddlewareService.requestBitcoinAddressInfo(address, blockchain, netType)
    .then((response) => {
      dispatch(BitcoinActions.bitcoinHttpGetAddressInfoSuccess(response.data, response.config.host))
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return getBalanceDataParser(blockchain, netType)(response) // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(BitcoinActions.bitcoinHttpGetAddressInfoFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}

const submitTransaction = (entry) => async (dispatch, getState) => {
  const state = getState()
  const description = describePendingBitcoinTx(
    entry,
    {
      token: getToken(entry.symbol)(state),
    })

  dispatch(modalsOpen({
    componentName: 'ConfirmTxDialog',
    props: {
      entry,
      description,
      accept: acceptTransaction,
      reject: (entry) => (dispatch) => dispatch(BitcoinActions.bitcoinTxReject(entry)),
    },
  }))
}

const acceptTransaction = (entry) => async (dispatch, getState) => {
  dispatch(BitcoinActions.bitcoinTxAccept(entry))

  const state = getState()
  const signer = getBitcoinSigner(state)

  const selectedEntry = pendingEntrySelector(entry.tx.from, entry.key, entry.blockchain)(state)

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
    const signedEntry = await dispatch(signTransaction({ entry, signer }))
    if (!signedEntry) {
      // eslint-disable-next-line no-console
      console.error('signedEntry is null', entry)
      return null // stop execute
    }
    return dispatch(sendSignedTransaction(signedEntry))
  } catch (error) {
    throw error
  }
}

export const updateWalletBalance = (wallet) => async (dispatch) => {
  const blockchain = wallet.blockchain
  const address = wallet.address

  return dispatch(getAddressInfo(address, blockchain))
    .then((balancesResult) => {
      const formattedBalances = formatBalances(blockchain, balancesResult)
      const newWallet = new WalletModel({
        ...wallet,
        balances: {
          ...wallet.balances,
          ...formattedBalances,
        },
      })

      const provider = getProviderByBlockchain(wallet.blockchain)
      provider.subscribe(wallet.address)

      dispatch({ type: WALLETS_SET, wallet: newWallet })
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.log('Balances call to middleware has failed [getAddressInfo]: ', blockchain, e)
    })
}

const signTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  try {
    dispatch(BitcoinActions.bitcoinSignTx())

    const network = getSelectedNetwork()(getState())
    const unsignedTxHex = entry.tx.prepared.buildIncomplete().toHex()

    dispatch(showSignerModal())
    const signedHex = await signer.signTransaction(unsignedTxHex, BitcoinUtils.getBitcoinDerivedPath(network[BLOCKCHAIN_BITCOIN]))
    dispatch(closeSignerModal())

    const bitcoinTransaction = bitcoin.Transaction.fromHex(signedHex)
    const bitcoinNetwork = bitcoin.networks[network[entry.blockchain]]
    const txb = new bitcoin.TransactionBuilder.fromTransaction(bitcoinTransaction, bitcoinNetwork)
    const bitcoinTxEntry = BitcoinUtils.createBitcoinTxEntryModel({
      ...entry,
      tx: {
        ...entry.tx,
        signed: txb.build(),
      },
    })

    dispatch(BitcoinActions.bitcoinTxUpdate(bitcoinTxEntry))
    dispatch(BitcoinActions.bitcoinSignTxSuccess(bitcoinTxEntry))
    return bitcoinTxEntry
  } catch (error) {
    dispatch(closeSignerModal())
    dispatch(notifyError(error, 'Trezor'))

    const bitcoinErrorTxEntry = BitcoinUtils.createBitcoinTxEntryModel({
      ...entry,
      isErrored: true,
      error,
    })
    dispatch(BitcoinActions.bitcoinTxUpdate(bitcoinErrorTxEntry))
    dispatch(BitcoinActions.bitcoinSignTxFailure(error))
    throw error
  }
}

// TODO: need to continue rework of this method. Pushed to merge with other changes.
const sendSignedTransaction = (entry) => async (dispatch, getState) => {
  if (!entry) {
    const error = new Error('Can\'t send empty Tx. There is no entry at BTC sendSignedTransaction')
    dispatch(BitcoinActions.bitcoinHttpPostSendTxFailure(error))
    throw new Error(error)
  }

  dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
    ...entry,
    isPending: true,
  })))

  try {
    dispatch(BitcoinActions.bitcoinHttpPostSendTx())

    const state = getState()
    const rawTx = entry.tx.signed.toHex()
    const blockchain = entry.blockchain
    const network = getSelectedNetwork()(state)
    const networkType = network[blockchain]

    return BitcoinMiddlewareService
      .requestBitcoinSendTx(rawTx, blockchain, networkType)
      .then((response) => {
        if (!response) {
          dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
            ...entry,
            isErrored: true,
          })))
          throw new Error('Incorrect response from server. Can\'t send transaction.')
        }
        dispatch(BitcoinActions.bitcoinHttpPostSendTxSuccess(response.data))

        if (response.data && response.data.code === 0) {
          dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
            ...entry,
            tx: {
              ...entry.tx,
              isErrored: true,
              error: response.data.message,
            },
          })))
          dispatch(notifyError(response.data, 'Bitcoin: sendSignedTransaction'))
        }

        if (response.data && response.data.hash) {
          const txEntry = BitcoinUtils.createBitcoinTxEntryModel({
            ...entry,
            tx: {
              ...entry.tx,
              isSent: true,
              isMined: false,
              hash: response.hash,
            },
          })
          dispatch(BitcoinActions.bitcoinTxUpdate(txEntry))
          dispatch(notifyBitcoinTransfer(txEntry))
        }

        dispatch(BitcoinActions.bitcoinExecuteTxSuccess(response.data)) // TODO: move it to appropriate place
        // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
        return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
      })
      .catch((error) => {
        dispatch(BitcoinActions.bitcoinHttpPostSendTxFailure(error))
        dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
          ...entry,
          isErrored: true,
        })))
        throw new Error(error) // Rethrow for further processing, for example by SubmissionError
      })
  } catch (error) {
    dispatch(BitcoinActions.bitcoinHttpPostSendTxFailure(error))
    dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
      ...entry,
      isErrored: true,
    })))
    return null
  }
}

const notifyBitcoinTransfer = (entry) => (dispatch, getState) => {
  const state = getState()
  const { tx } = entry
  const token = getToken(entry.symbol)(state)

  dispatch(notify(new TransferNoticeModel({
    amount: token.removeDecimals(tx.amount),
    symbol: token.symbol(),
    from: entry.tx.from,
    to: entry.tx.to,
  })))
}

export const estimateBtcFee = (params) => async (dispatch) => {
  const { address, recipient, amount, formFee, blockchain } = params
  const utxos = await dispatch(getAddressUTXOS(address, blockchain))
  if (!utxos) {
    throw new Error(`Can't find utxos for address: ${address}`)
  }

  return BitcoinUtils.getBtcFee(recipient, amount, formFee, utxos)
}

export const enableBitcoin = (blockchainName) => async (dispatch) => {
  if (!blockchainName || !daoMap[blockchainName]) {
    throw new Error(`Blockchain name is empty or not a BTC like: [${blockchainName}]`)
  }

  await dispatch(initToken(blockchainName))
  await dispatch(initWallet(blockchainName))
}

const initToken = (blockchainName) => async (dispatch, getState) => {
  const state = getState()
  const dao = daoMap[blockchainName]

  dao.on(EVENT_UPDATE_LAST_BLOCK, (newBlock) => {
    const blocks = state.get(DUCK_TOKENS).latestBlocks()
    const currentBlock = blocks[dao.getBlockchain()]
    if (currentBlock && newBlock.block.blockNumber > currentBlock.blockNumber) {
      dispatch(TokensActions.setLatestBlock(newBlock.blockchain, newBlock.block))
    }
  })
  await dao.watchLastBlock()
  dao.watch()
  const token = await dao.fetchToken()
  tokenService.registerDAO(token, dao)
  dispatch(TokensActions.tokenFetched(token))

  try {
    // DASH still uses BlockExplorerNode, it has no CurrentBlockHeight method. Wait for a new Middleware DASH node
    const currentBlock = await dao.getCurrentBlockHeight()
    dispatch(TokensActions.setLatestBlock(token.blockchain(), { blockNumber: currentBlock.currentBlock }))
  } catch (e) {
    // eslint-disable-next-line
    console.warn('Update current block height error: ', e)
  }
}

const initWallet = (blockchainName) => async (dispatch, getState) => {
  const state = getState()
  const { network } = getCurrentNetworkSelector(state)

  const addressCache = { ...getAddressCache(state) }

  const signerSelectorsMap = {
    [BLOCKCHAIN_BITCOIN]: {
      selector: getBitcoinSigner,
      path: BitcoinUtils.getBitcoinDerivedPath(network[BLOCKCHAIN_BITCOIN]),
    },
    [BLOCKCHAIN_BITCOIN_CASH]: {
      selector: getBitcoinCashSigner,
      path: BitcoinUtils.getBitcoinDerivedPath(network[BLOCKCHAIN_BITCOIN_CASH], COIN_TYPE_BCC_MAINNET),
    },
    [BLOCKCHAIN_DASH]: {
      selector: getDashSigner,
      path: BitcoinUtils.getBitcoinDerivedPath(network[BLOCKCHAIN_DASH], COIN_TYPE_DASH_MAINNET),
    },
    [BLOCKCHAIN_LITECOIN]: {
      selector: getLitecoinSigner,
      path: BitcoinUtils.getLitecoinDerivedPath(network[BLOCKCHAIN_LITECOIN], COIN_TYPE_LTC_MAINNET),
    },
  }

  if (!addressCache[blockchainName] || true) {
    const { selector, path } = signerSelectorsMap[blockchainName]
    const signer = selector(state)

    if (signer) {
      const address = await signer.getAddress(path)
      addressCache[blockchainName] = {
        address,
        path,
      }

      dispatch({
        type: WALLETS_CACHE_ADDRESS,
        blockchain: blockchainName,
        address,
        path,
      })
    }
  }

  const { address, path } = addressCache[blockchainName]
  const wallet = new WalletModel({
    address,
    blockchain: blockchainName,
    isMain: true,
    walletDerivedPath: path,
  })

  getProviderByBlockchain(blockchainName).subscribe(wallet.address)

  dispatch({ type: WALLETS_SET, wallet })
  dispatch(updateWalletBalance(wallet))
}

export const disableBitcoin = (blockchainName) => async (dispatch, getState) => {
  const wallets = getWalletsByBlockchain(blockchainName)(getState())

  wallets.forEach((wallet) => {
    getProviderByBlockchain(blockchainName).unsubscribe(wallet.address)
    dispatch({ type: WALLETS_UNSET, wallet })
  })
}
