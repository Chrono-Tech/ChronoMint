/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { bccProvider, btcProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import { dashProvider } from '@chronobank/login/network/DashProvider'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
  WALLET_HD_PATH,
} from '@chronobank/login/network/constants'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import WalletModel from '../../models/wallet/WalletModel'
import { subscribeOnTokens } from '../tokens/thunks'
import { formatBalances, getProviderByBlockchain, getWalletBalances } from '../tokens/utils'
import TokenModel from '../../models/tokens/TokenModel'
import EthereumMemoryDevice from '../../services/signers/EthereumMemoryDevice'
import tokenService from '../../services/TokenService'
import Amount from '../../models/Amount'
import { getAccount } from '../session/selectors'
import { getMainEthWallet, getWallet, getWallets } from './selectors/models'
import { notifyError } from '../notifier/actions'
import { DUCK_SESSION } from '../session/constants'
import { AllowanceCollection } from '../../models'
import { executeDashTransaction } from '../dash/thunks'
import { executeTransaction } from '../ethereum/thunks'
import { executeWavesTransaction } from '../waves/thunks'
import * as BitcoinThunks from '../bitcoin/thunks'
import {
  WALLETS_SET,
  WALLETS_SET_NAME,
  WALLETS_UPDATE_BALANCE,
  WALLETS_UPDATE_WALLET,
} from './constants'
import { executeNemTransaction } from '../nem/thunks'
import { getEthereumSigner, getPersistAccount, getAddressCache } from '../persistAccount/selectors'
import { getBitcoinCashSigner, getBitcoinSigner, getLitecoinSigner } from '../bitcoin/selectors'
import { getDashSigner } from '../dash/selectors'
import { getNemSigner } from '../nem/selectors'
import { getWavesSigner } from '../waves/selectors'
import TxHistoryModel from '../../models/wallet/TxHistoryModel'
import { TXS_PER_PAGE } from '../../models/wallet/TransactionsCollection'
import { BCC, BTC, DASH, ETH, LTC, WAVES, XEM } from '../../dao/constants'
import TxDescModel from '../../models/TxDescModel'
import { initEos } from '../eos/thunks'
import { getTokens } from '../tokens/selectors'
import { accountCacheAddress } from '../persistAccount/actions'
import { getBitcoinDerivedPath } from '../bitcoin/utils'
import { getNemDerivedPath } from '../nem/utils'
import { getWavesDerivedPath } from '../waves/utils'

const isOwner = (wallet, account) => {
  return wallet.owners.includes(account)
}

export const get2FAEncodedKey = (callback) => () => {
  return ethereumProvider.get2FAEncodedKey(callback)
}

export const setWalletName = (walletId, name) => (dispatch) => dispatch({ type: WALLETS_SET_NAME, walletId, name })

export const setWallet = (wallet) => (dispatch) => {
  const provider = getProviderByBlockchain(wallet.blockchain)
  provider.subscribe(wallet.address)

  dispatch({ type: WALLETS_SET, wallet })
}

export const setWalletBalance = (walletId, balance) => (dispatch) => dispatch({ type: WALLETS_UPDATE_BALANCE, walletId, balance })

export const initWallets = () => (dispatch) => {
  dispatch(initWalletsFromKeys())
  dispatch(initDerivedWallets())
}

const initWalletsFromKeys = () => async (dispatch, getState) => {
  const state = getState()
  const account = getPersistAccount(state)
  const { network } = getCurrentNetworkSelector(state)

  const addressCache = { ...getAddressCache(state) }

  const wallets = []
  const accountEthereumPath = account.decryptedWallet.entry.encrypted[0].path

  const signerSelectors = {
    [BLOCKCHAIN_ETHEREUM]: {
      signerSelector: getEthereumSigner,
      path: accountEthereumPath,
    },
    [BLOCKCHAIN_BITCOIN]: {
      signerSelector: getBitcoinSigner,
      path: getBitcoinDerivedPath(network[BLOCKCHAIN_BITCOIN]),
    },
    [BLOCKCHAIN_BITCOIN_CASH]: {
      signerSelector: getBitcoinCashSigner,
      path: getBitcoinDerivedPath(network[BLOCKCHAIN_BITCOIN_CASH]),
    },
    [BLOCKCHAIN_DASH]: {
      signerSelector: getDashSigner,
      path: getBitcoinDerivedPath(network[BLOCKCHAIN_DASH]),
    },
    [BLOCKCHAIN_LITECOIN]: {
      signerSelector: getLitecoinSigner,
      path: getBitcoinDerivedPath(network[BLOCKCHAIN_LITECOIN]),
    },
    [BLOCKCHAIN_NEM]: {
      signerSelector: getNemSigner,
      path: getNemDerivedPath(network[BLOCKCHAIN_NEM]),
    },
    [BLOCKCHAIN_WAVES]: {
      signerSelector: getWavesSigner,
      path: getWavesDerivedPath(network[BLOCKCHAIN_WAVES]),
    },
  }

  Object.entries(signerSelectors).forEach(async ([ blockchain, { signerSelector, path } ]) => {
    let address = addressCache[blockchain]
    if(!address) {
      const signer = signerSelector(state)
      if (signer) {
        address = await signer.getAddress(path)
        addressCache[blockchain] = {
          address,
          path,
        }

        dispatch(accountCacheAddress({ blockchain, address, path }))
      }
    }
  })

  Object.entries(addressCache).forEach(async ([ blockchain, { address, path } ]) => {
    wallets.push(new WalletModel({
      address,
      blockchain,
      isMain: true,
      walletDerivedPath: path,
    }))
  })

  wallets.forEach((wallet) => {
    dispatch(setWallet(wallet))
    dispatch(updateWalletBalance({ wallet }))
  })

  dispatch(initEos())
}

const initDerivedWallets = () => async (dispatch, getState) => {
  const state = getState()
  const account = getAccount(state)
  const wallets = getWallets(state)

  Object.values(wallets).forEach((wallet: WalletModel) => {
    if (wallet.isDerived && !wallet.isMain && isOwner(wallet, account)) {
      dispatch(updateWalletBalance({ wallet }))

      switch (wallet.blockchain) {
        case BLOCKCHAIN_BITCOIN:
          btcProvider.createNewChildAddress(wallet.deriveNumber)
          btcProvider.subscribeNewWallet(wallet.address)
          break
        case BLOCKCHAIN_BITCOIN_CASH:
          bccProvider.createNewChildAddress(wallet.deriveNumber)
          bccProvider.subscribeNewWallet(wallet.address)
          break
        case BLOCKCHAIN_DASH:
          dashProvider.createNewChildAddress(wallet.deriveNumber)
          dashProvider.subscribeNewWallet(wallet.address)
          break
        case BLOCKCHAIN_LITECOIN:
          ltcProvider.createNewChildAddress(wallet.deriveNumber)
          ltcProvider.subscribeNewWallet(wallet.address)
          break
        case BLOCKCHAIN_ETHEREUM:
          break
        default:
      }
    }
  })
}

const fallbackCallback = (wallet) => (dispatch) => {
  const updateBalance = (token: TokenModel) => async () => {
    if (token.blockchain() === wallet.blockchain) {
      const dao = tokenService.getDAO(token)
      const balance = await dao.getAccountBalance(wallet.address)
      if (balance) {
        dispatch(setWalletBalance(wallet.id, new Amount(balance, token.symbol(), true)))
      }
    }
  }
  dispatch(subscribeOnTokens(updateBalance))
}

export const updateWalletBalance = ({ wallet }) => async (dispatch) => {
  const blockchain = wallet.blockchain
  const address = wallet.address

  if (blockchain === BLOCKCHAIN_NEM) {
    return dispatch(fallbackCallback(wallet))
  }

  const isBtcLikeBlockchain = [
    BLOCKCHAIN_BITCOIN,
    BLOCKCHAIN_BITCOIN_CASH,
    BLOCKCHAIN_DASH,
    BLOCKCHAIN_LITECOIN,
  ].includes(blockchain)

  if (isBtcLikeBlockchain) {
    return dispatch(BitcoinThunks.getAddressInfo(address, blockchain))
      .then((balancesResult) => {
        const formattedBalances = formatBalances(blockchain, balancesResult)
        const newWallet = new WalletModel({
          ...wallet,
          balances: {
            ...wallet.balances,
            ...formattedBalances,
          },
        })
        dispatch(setWallet(newWallet))
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log('Balances call to middleware has failed [getAddressInfo]: ', blockchain, e)
        dispatch(fallbackCallback(wallet))
      })
  } else {
    getWalletBalances({ wallet })
      .then((balancesResult) => {
        try {
          dispatch(setWallet(new WalletModel({
            ...wallet,
            balances: {
              ...wallet.balances,
              ...formatBalances(blockchain, balancesResult),
            },
          })))
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e.message)
        }
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log('call balances from middleware is failed getWalletBalances', e)
        dispatch(fallbackCallback(wallet))
      })
  }
}

const updateAllowance = (allowance) => (dispatch, getState) => {
  const wallet = getMainEthWallet(getState())
  if (allowance) {
    dispatch({
      type: WALLETS_UPDATE_WALLET,
      wallet: new WalletModel({
        ...wallet,
        allowances: new AllowanceCollection({
          list: {
            ...wallet.allowances.list,
            [allowance.id()]: allowance,
          },
        }),
      }),
    })
  }
}

export const mainTransfer = (
  wallet: WalletModel,
  token: TokenModel,
  amount: Amount,
  recipient: string,
  feeMultiplier: number = 1,
  advancedParams = null,
) => async (dispatch) => {
  try {
    const tokenDAO = tokenService.getDAO(token.id())
    const tx = tokenDAO.transfer(wallet.address, recipient, amount)
    const executeMap = {
      [BLOCKCHAIN_ETHEREUM]: executeTransaction,
      [BLOCKCHAIN_NEM]: executeNemTransaction,
      [BLOCKCHAIN_BITCOIN]: BitcoinThunks.executeBitcoinTransaction,
      [BLOCKCHAIN_DASH]: executeDashTransaction,
      [BLOCKCHAIN_WAVES]: executeWavesTransaction,
    }

    // execute
    dispatch(executeMap[wallet.blockchain]({
      tx,
      options: {
        feeMultiplier,
        walletDerivedPath: wallet.derivedPath,
        symbol: token.symbol(),
        ...advancedParams,
      },
    }))

  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    dispatch(notifyError(e))
  }
}

export const mainApprove = (token: TokenModel, amount: Amount, spender: string, feeMultiplier: number) => async (dispatch, getState) => {
  const state = getState()
  const wallet = getMainEthWallet(state)
  const allowance = wallet.allowances.list[`${spender}-${token.id()}`]
  const { account } = state.get(DUCK_SESSION)

  try {
    allowance && dispatch(updateAllowance(allowance.isFetching(true)))
    const tokenDAO = tokenService.getDAO(token)
    const tx = tokenDAO.approve(spender, amount, account)
    if (tx) {
      await dispatch(executeTransaction({ tx, options: { feeMultiplier } }))
    }
  } catch (e) {
    dispatch(notifyError(e, 'mainApprove'))
    allowance && dispatch(updateAllowance(allowance.isFetching(false)))
  }
}

export const mainRevoke = (token: TokenModel, spender: string, feeMultiplier: number = 1) => async (dispatch, getState) => {
  const state = getState()
  const wallet = getMainEthWallet(state)
  const allowance = wallet.allowances.list[`${spender}-${token.id()}`]
  dispatch(updateAllowance(allowance.isFetching(true)))

  const { account } = state.get(DUCK_SESSION)
  try {
    dispatch(updateAllowance(allowance.isFetching(true)))
    const tokenDAO = tokenService.getDAO(token)
    const tx = tokenDAO.revoke(spender, token.symbol(), account)
    if (tx) {
      await dispatch(executeTransaction({ tx, options: { feeMultiplier } }))
    }
  } catch (e) {
    dispatch(notifyError(e, 'mainRevoke'))
    dispatch(updateAllowance(allowance.isFetching(false)))
  }
}

// eslint-disable-next-line complexity
export const createNewChildAddress = ({ blockchain, tokens, name, deriveNumber }) => async (dispatch, getState) => {
  const state = getState()
  const signer = getEthereumSigner(state)
  const account = getState().get(DUCK_SESSION).account
  const wallets = getWallets(state)

  const lastDeriveNumbers = {}
  Object.values(wallets)
    .forEach((wallet) => {
      if (wallet.derivedPath && isOwner(wallet, account)) {
        if (!lastDeriveNumbers[wallet.blockchain()] || (lastDeriveNumbers[wallet.blockchain()] && lastDeriveNumbers[wallet.blockchain()] < wallet.deriveNumber)) {
          lastDeriveNumbers[wallet.blockchain()] = wallet.deriveNumber
        }
      }
    })

  let newDeriveNumber = deriveNumber
  let derivedPath
  let newWallet
  let address

  switch (blockchain) {
    case BLOCKCHAIN_ETHEREUM:
      if (newDeriveNumber === undefined || newDeriveNumber === null) {
        newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      }
      derivedPath = `${WALLET_HD_PATH}/${newDeriveNumber}`
      const newWalletSigner = await EthereumMemoryDevice.getDerivedWallet(signer.privateKey, derivedPath)
      address = newWalletSigner.address
      break

    case BLOCKCHAIN_BITCOIN:
      if (newDeriveNumber === undefined || newDeriveNumber === null) {
        newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      }
      derivedPath = `${WALLET_HD_PATH}/${newDeriveNumber}`
      newWallet = btcProvider.createNewChildAddress(newDeriveNumber)
      address = newWallet.getAddress()
      btcProvider.subscribeNewWallet(address)
      break

    case BLOCKCHAIN_LITECOIN:
      if (newDeriveNumber === undefined || newDeriveNumber === null) {
        newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      }
      derivedPath = `${WALLET_HD_PATH}/${newDeriveNumber}`
      newWallet = ltcProvider.createNewChildAddress(newDeriveNumber)
      address = newWallet.getAddress()
      ltcProvider.subscribeNewWallet(address)
      break

    case BLOCKCHAIN_NEM:
    case BLOCKCHAIN_WAVES:
    default:
      return null
  }

  const wallet = new WalletModel({
    name,
    address,
    owners: [account],
    isFetched: true,
    deriveNumber: newDeriveNumber,
    derivedPath,
    blockchain,
    customTokens: tokens,
    isDerived: true,
  })

  dispatch(setWallet(wallet))
  dispatch(updateWalletBalance({ wallet }))
}

export const getTransactionsForMainWallet = ({ blockchain, address, forcedOffset }) => async (dispatch, getState) => {
  const state = getState()
  const wallet = getWallet(blockchain, address)(state)
  if (!wallet) {
    return null
  }

  dispatch({
    type: WALLETS_UPDATE_WALLET,
    wallet: new WalletModel({
      ...wallet,
      transactions: new TxHistoryModel(
        {
          ...wallet.transactions,
          isFetching: true,
        }),
    }),
  })

  const tokens = getTokens(state)
  const transactions = await getTxList({ wallet, forcedOffset, tokens })

  const newWallet = getWallet(wallet.blockchain, wallet.address)(getState())
  dispatch({
    type: WALLETS_UPDATE_WALLET,
    wallet: new WalletModel({ ...newWallet, transactions }),
  })
}

export const getTxList = async ({ wallet, forcedOffset, tokens }) => {

  const transactions: TxHistoryModel = new TxHistoryModel({ ...wallet.transactions })
  const offset = forcedOffset ? 0 : (transactions.transactions.length || 0)
  const newOffset = offset + TXS_PER_PAGE

  let dao

  switch (wallet.blockchain) {
    case BLOCKCHAIN_ETHEREUM:
      dao = tokenService.getDAO(ETH)
      break
    case BLOCKCHAIN_BITCOIN:
      dao = tokenService.getDAO(BTC)
      break
    case BLOCKCHAIN_BITCOIN_CASH:
      dao = tokenService.getDAO(BCC)
      break
    case BLOCKCHAIN_DASH:
      dao = tokenService.getDAO(DASH)
      break
    case BLOCKCHAIN_LITECOIN:
      dao = tokenService.getDAO(LTC)
      break
    case BLOCKCHAIN_NEM:
      dao = tokenService.getDAO(XEM)
      break
    case BLOCKCHAIN_WAVES:
      dao = tokenService.getDAO(WAVES)
      break
  }

  const blocks = transactions.blocks
  let endOfList = false
  if (dao) {
    const txList = await dao.getTransfer(wallet.address, wallet.address, offset, TXS_PER_PAGE, tokens)

    txList.sort((a, b) => b.time - a.time)

    for (const tx: TxDescModel of txList) {
      if (!blocks[tx.blockNumber]) {
        blocks[tx.blockNumber] = { transactions: [] }
      }
      blocks[tx.blockNumber].transactions.push(tx)
    }

    if (transactions.transactions.length < newOffset) {
      endOfList = true
    }
  }

  return new TxHistoryModel({
    ...transactions,
    blocks,
    endOfList,
    isFetching: false,
    isFetched: true,
    isLoaded: true,
  })
}
