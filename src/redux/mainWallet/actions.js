/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { bccProvider, BLOCKCHAIN_BITCOIN, BLOCKCHAIN_LITECOIN, btcProvider, btgProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import { change, formValueSelector } from 'redux-form/immutable'
import { history } from 'redux/configureStore'
import { nemProvider } from '@chronobank/login/network/NemProvider'
import { push } from 'react-router-redux'
import { EVENT_APPROVAL_TRANSFER, EVENT_NEW_TRANSFER, EVENT_UPDATE_BALANCE, FETCH_NEW_BALANCE } from 'dao/AbstractTokenDAO'
import assetDonatorDAO from 'dao/AssetDonatorDAO'
import ethereumDAO, { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import Amount from 'models/Amount'
import ApprovalNoticeModel from 'models/notices/ApprovalNoticeModel'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import BalanceModel from 'models/tokens/BalanceModel'
import TokenModel from 'models/tokens/TokenModel'
import validator from 'models/validator'
import AddressModel from 'models/wallet/AddressModel'
import AllowanceModel from 'models/wallet/AllowanceModel'
import TransactionsCollection, { TXS_PER_PAGE } from 'models/wallet/TransactionsCollection'
import { addMarketToken } from 'redux/market/action'
import { notify, notifyError } from 'redux/notifier/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_TOKENS, subscribeOnTokens } from 'redux/tokens/actions'
import tokenService from 'services/TokenService'
import type TxModel from 'models/TxModel'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { TX_DEPOSIT, TX_WITHDRAW_SHARES } from 'dao/AssetHolderDAO'
import { TX_APPROVE } from 'dao/ERC20DAO'
import OwnerCollection from 'models/wallet/OwnerCollection'
import OwnerModel from 'models/wallet/OwnerModel'
import { DUCK_MULTISIG_WALLET, MULTISIG_BALANCE, MULTISIG_FETCHED, MULTISIG_UPDATE } from 'redux/multisigWallet/actions'
import DerivedWalletModel from 'models/wallet/DerivedWalletModel'
import AddressesCollection from 'models/wallet/AddressesCollection'
import { getDeriveWalletsAddresses } from 'redux/wallet/selectors'

export const DUCK_MAIN_WALLET = 'mainWallet'
export const FORM_ADD_NEW_WALLET = 'FormAddNewWallet'

// TODO @ipavlenko: Odd code, remove WALLET_BALANCE
export const WALLET_BALANCE = 'mainWallet/BALANCE'
export const WALLET_ALLOWANCE = 'mainWallet/ALLOWANCE'
export const WALLET_ADDRESS = 'mainWallet/WALLET_ADDRESS'
export const WALLET_TRANSACTIONS_FETCH = 'mainWallet/TRANSACTIONS_FETCH'
export const WALLET_TRANSACTION = 'mainWallet/TRANSACTION'
export const WALLET_TRANSACTIONS = 'mainWallet/TRANSACTIONS'
export const WALLET_IS_TIME_REQUIRED = 'mainWallet/IS_TIME_REQUIRED'
export const WALLET_TOKEN_BALANCE = 'mainWallet/TOKEN_BALANCE'
export const WALLET_INIT = 'mainWallet/INIT'
export const WALLET_SET_NAME = 'mainWallet/SET_NAME'

export const ETH = ethereumDAO.getSymbol()
export const TIME = 'TIME'
export const LHT = 'LHT'
export const BTC = 'BTC'
export const BCC = 'BCC'
export const BTG = 'BTG'
export const LTC = 'LTC'
export const XEM = 'XEM'

export const goToWallets = () => (dispatch) => dispatch(push('/wallets'))

export const goBackForAddWalletsForm = () => (dispatch, getState) => {
  const selector = formValueSelector(FORM_ADD_NEW_WALLET)
  const state = getState()
  let blockchain = selector(state, 'blockchain')
  let ethWalletType = selector(state, 'ethWalletType')

  if (ethWalletType) {
    dispatch(change(FORM_ADD_NEW_WALLET, 'ethWalletType', null))
    return
  }

  if (blockchain) {
    dispatch(change(FORM_ADD_NEW_WALLET, 'blockchain', null))
    return
  }
  history.goBack()
}

const handleToken = (token: TokenModel) => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const tokens = getState().get(DUCK_TOKENS)

  dispatch(fetchTokenBalance(token))
  if (tokens.leftToFetch() === 0) {
    dispatch(getAccountTransactions())
  }

  const symbol = token.symbol()
  const tokenDAO = tokenService.getDAO(token.id())

  // subscribe
  tokenDAO
    .on(EVENT_NEW_TRANSFER, (tx: TxModel) => {
      const walletsAccounts = getDeriveWalletsAddresses(getState(), token.blockchain())

      if (walletsAccounts.includes(tx.from()) || walletsAccounts.includes(tx.to()) || tx.from() === account || tx.to() === account) {
        dispatch(notify(new TransferNoticeModel({
          value: token.removeDecimals(tx.value()),
          symbol,
          from: tx.from(),
          to: tx.to(),
        })))
      }

      if (tx.from() === account || tx.to() === account) { // for main wallet
        // add to table
        // TODO @dkchv: !!! restore after fix
        dispatch({ type: WALLET_TRANSACTION, tx })
        if (!(tx.from() === account || tx.to() === account)) {
          return
        }
        // No need to update balance manually for tokens with balance stream support, see EVENT_UPDATE_BALANCE
        if (!tokenDAO.hasBalancesStream()) {
          // update balance
          dispatch(fetchTokenBalance(token))
        }
        // update donator
        if (tx.from() === assetDonatorDAO.getInitAddress()) {
          dispatch(updateIsTIMERequired())
        }
      }

      if (walletsAccounts.includes(tx.from()) || walletsAccounts.includes(tx.to())) { // for derive wallets
        const walletFrom = getState().get(DUCK_MULTISIG_WALLET).item(tx.from())
        const callback = async (wallet: DerivedWalletModel) => {

          dispatch({ type: MULTISIG_FETCHED, wallet: wallet.transactions(wallet.transactions().add(tx)) })

          const dao = tokenService.getDAO(token)
          const balance = await dao.getAccountBalance(wallet.address())
          dispatch({
            type: MULTISIG_BALANCE,
            walletId: wallet.address(),
            balance: new BalanceModel({
              id: token.id(),
              amount: new Amount(balance, token.symbol(), true),
            }),
          })
        }

        if (walletFrom && walletFrom.isFetched()) {
          callback(walletFrom)
        }
        const walletTo = getState().get(DUCK_MULTISIG_WALLET).item(tx.to())
        if (walletTo && walletTo.isFetched()) {
          callback(walletTo)
        }
      }

    })
    .on(FETCH_NEW_BALANCE, () => {
      dispatch(fetchTokenBalance(token))
    })
    .on(EVENT_UPDATE_BALANCE, ({ /* account, time, */ balance }) => {
      // TODO @ipavlenko: Always check user account
      dispatch({
        type: WALLET_TOKEN_BALANCE,
        balance: new BalanceModel({
          id: token.id(),
          amount: new Amount(balance, token.symbol()),
        }),
      })
    })
    .on(EVENT_APPROVAL_TRANSFER, ({ spender, value }) => {
      dispatch(notify(new ApprovalNoticeModel({
        value: token.removeDecimals(value),
        symbol,
        spender,
      })))

      dispatch({
        type: WALLET_ALLOWANCE, allowance: new AllowanceModel({
          amount: new Amount(value, token.id()),
          spender,
          token: token.id(),
          isFetching: false,
          isFetched: true,
        }),
      })
    })

  await tokenDAO.watch([...getDeriveWalletsAddresses(getState(), token.blockchain()), account])

  dispatch(addMarketToken(token.symbol()))

  if (token.symbol() === 'TIME') {
    dispatch(updateIsTIMERequired())
  }
}

export const fetchTokenBalance = (token: TokenModel) => async (dispatch, getState) => {
  const tokenDAO = tokenService.getDAO(token.id())
  const { account } = getState().get(DUCK_SESSION)
  const balance = await tokenDAO.getAccountBalance(account)
  dispatch({
    type: WALLET_TOKEN_BALANCE,
    balance: new BalanceModel({
      id: token.id(),
      amount: new Amount(balance, token.symbol()),
    }),
  })
}

export const initMainWallet = () => async (dispatch, getState) => {
  if (getState().get(DUCK_MAIN_WALLET).isInited()) {
    return
  }
  dispatch({ type: WALLET_INIT, isInited: true })

  dispatch(subscribeOnTokens(handleToken))

  const providers = [
    bccProvider,
    btgProvider,
    ltcProvider,
    btcProvider,
    nemProvider,
    ethereumProvider,
  ]
  providers.map((provider) => {
    dispatch({
      type: WALLET_ADDRESS, address: new AddressModel({
        id: provider.id(),
        address: provider.getAddress(),
      }),
    })
  })
}

export const mainTransfer = (wallet: DerivedWalletModel, token: TokenModel, amount: Amount, recipient: string, feeMultiplier: Number = 1, advancedModeParams = undefined) => async (dispatch, getState) => {
  try {
    console.log('mainTransfer mainTransfer : ', advancedModeParams)
    const sendWallet = wallet || getState().get(DUCK_MAIN_WALLET)
    const tokenDAO = tokenService.getDAO(token.id())
    await tokenDAO.transfer(sendWallet.addresses().item(token.blockchain()).address(), recipient, amount, token, feeMultiplier, advancedModeParams)
  } catch (e) {
    dispatch(notifyError(e, 'mainTransfer'))
  }
}

export const mainApprove = (token: TokenModel, amount: Amount, spender: string, feeMultiplier: Number = 1) => async (dispatch, getState) => {
  const allowance = getState().get(DUCK_MAIN_WALLET).allowances().item(spender, token.id())
  try {
    dispatch({ type: WALLET_ALLOWANCE, allowance: allowance.isFetching(true) })
    const tokenDAO = tokenService.getDAO(token)
    await tokenDAO.approve(spender, amount, feeMultiplier)
  } catch (e) {
    dispatch(notifyError(e, 'mainApprove'))
    dispatch({ type: WALLET_ALLOWANCE, allowance: allowance.isFetching(false) })
  }
}

export const mainRevoke = (token: TokenModel, spender: string, feeMultiplier: Number = 1) => async (dispatch, getState) => {
  const allowance = getState().get(DUCK_MAIN_WALLET).allowances().item(spender, token.id())
  try {
    dispatch({ type: WALLET_ALLOWANCE, allowance: allowance.isFetching(true) })
    const tokenDAO = tokenService.getDAO(token)
    await tokenDAO.revoke(spender, token.symbol(), feeMultiplier)
  } catch (e) {
    dispatch(notifyError(e, 'mainRevoke'))
    dispatch({ type: WALLET_ALLOWANCE, allowance: allowance.isFetching(false) })
  }
}

export const updateIsTIMERequired = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  try {
    dispatch({ type: WALLET_IS_TIME_REQUIRED, value: await assetDonatorDAO.isTIMERequired(account) })
  } catch (e) {
    // eslint-disable-next-line
    console.error('require time error', e.message)
  }
}

export const requireTIME = () => async () => {
  try {
    await assetDonatorDAO.requireTIME()
  } catch (e) {
    // eslint-disable-next-line
    console.error('require time error', e.message)
  }
}

/**
 * LATEST TRANSACTIONS
 */
const getTransferId = 'wallet'

export const getAccountTransactions = () => async (dispatch, getState) => {
  // TODO @ipavlenk: It seems it is wrong tokens source, odd code, there is only ETH token
  const tokens = getState().get(DUCK_TOKENS).items()
  dispatch({ type: WALLET_TRANSACTIONS_FETCH })

  const wallet = getState().get(DUCK_MAIN_WALLET)
  let transactions: TransactionsCollection = wallet.transactions()
  const offset = transactions.offset() || 0
  const newOffset = offset + TXS_PER_PAGE
  let newTxs = []
  if (transactions.size() <= newOffset) {
    const promises = []
    for (let token: TokenModel of tokens) {
      if (token.symbol()) {
        const tokenDAO = tokenService.getDAO(token.id())
        promises.push(tokenDAO.getTransfer(getTransferId, wallet.addresses().item(token.blockchain()).address(), offset, TXS_PER_PAGE))
      }
    }
    const result = await Promise.all(promises)
    for (let pack of result) {
      newTxs = [...newTxs, ...pack]
    }

    newTxs.sort((a, b) => b.get('time') - a.get('time'))
  }

  for (let tx: TxModel of newTxs) {
    transactions = transactions.add(tx)
  }

  if (transactions.items().length === wallet.transactions().items().length) {
    transactions = transactions.endOfList(true)
  }

  dispatch({ type: WALLET_TRANSACTIONS, map: transactions.offset(newOffset) })
}

export const getSpendersAllowance = (tokenId: string, spender: string) => async (dispatch, getState) => {
  if (validator.address(spender) !== null || !tokenId) {
    return null
  }
  const { account } = getState().get(DUCK_SESSION)
  const dao = tokenService.getDAO(tokenId)
  const allowance = await dao.getAccountAllowance(account, spender)
  console.log('--actions#', 1)
  dispatch({
    type: WALLET_ALLOWANCE, allowance: new AllowanceModel({
      amount: new Amount(allowance, tokenId),
      spender, //address
      token: tokenId, // id
      isFetching: false,
      isFetched: true,
    }),
  })
}

export const estimateGasForDeposit = async (mode: string, params, callback, gasPriseMultiplier = 1) => {
  let dao = null
  switch (mode) {
    case TX_APPROVE:
      dao = await tokenService.getDAO(TIME)
      break
    case TX_DEPOSIT:
    case TX_WITHDRAW_SHARES:
      dao = await contractsManagerDAO.getAssetHolderDAO()
      break
  }
  try {
    if (!dao) {
      throw new Error('Dao is undefined')
    }
    const { gasLimit, gasFee, gasPrice } = await dao.estimateGas(...params)
    callback(null, {
      gasLimit,
      gasFee: new Amount(gasFee.mul(gasPriseMultiplier), ETH),
      gasPrice: new Amount(gasPrice.mul(gasPriseMultiplier), ETH),
    })
  } catch (e) {
    callback(e)
  }
}

const getTokensBalancesAndWatch = (address, blockchain, customTokens: Array<string>) => (token) => async (dispatch) => {

  if (blockchain !== token.blockchain() || (token.symbol() !== ETH && customTokens && !customTokens.includes(token.symbol()))) {
    return null
  }

  const dao = tokenService.getDAO(token)
  const balance = await dao.getAccountBalance(address)
  dispatch({
    type: MULTISIG_BALANCE,
    walletId: address,
    balance: new BalanceModel({
      id: token.id(),
      amount: new Amount(balance, token.symbol(), true),
    }),
  })

  await dao.watch(address)
}

export const createNewChildAddress = ({ blockchain, tokens, name }) => async (dispatch, getState) => {
  const account = getState().get(DUCK_SESSION).account
  const wallets = getState().get(DUCK_MULTISIG_WALLET)
  let ownersCollection = new OwnerCollection()
  ownersCollection = ownersCollection.update(new OwnerModel({
    address: account,
    isSelf: true,
  }))

  let lastDeriveNumbers = {}
  wallets
    .items()
    .map((wallet) => {
      if (wallet.owners().items().filter((owner) => owner.address() === account).length > 0 && wallet instanceof DerivedWalletModel) {
        const deriveNumber = wallet.deriveNumber ? wallet.deriveNumber() : null
        if (!lastDeriveNumbers[wallet.blockchain()] || (lastDeriveNumbers[wallet.blockchain()] && lastDeriveNumbers[wallet.blockchain()] < deriveNumber)) {
          lastDeriveNumbers[wallet.blockchain()] = deriveNumber
        }
      }
    })

  let wallet
  let newDeriveNumber
  let newWallet
  let address

  switch (blockchain) {
    case BLOCKCHAIN_ETHEREUM:
      newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      newWallet = ethereumProvider.createNewChildAddress(newDeriveNumber)
      address = newWallet.getAddressString()

      ethereumProvider.addNewEthWallet(newDeriveNumber)
      break
    case BLOCKCHAIN_BITCOIN:
      newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      newWallet = btcProvider.createNewChildAddress(newDeriveNumber)
      address = newWallet.getAddress()
      break
    case BLOCKCHAIN_LITECOIN:
      newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      newWallet = btcProvider.createNewChildAddress(newDeriveNumber)
      address = newWallet.getAddress()
      break
    case 'Bitcoin Gold':
    case 'NEM':
    default:
      return null
  }

  wallet = new DerivedWalletModel({
    name,
    address,
    addresses: new AddressesCollection()
      .add(new AddressModel({ id: blockchain, address })),
    owners: ownersCollection,
    isMultisig: false,
    isFetched: true,
    deriveNumber: newDeriveNumber,
    blockchain,
    customTokens: tokens,
  })

  dispatch({ type: MULTISIG_FETCHED, wallet })
  dispatch(subscribeOnTokens(getTokensBalancesAndWatch(address, blockchain, tokens)))
}

export const resetWalletsForm = () => (dispatch) => {
  dispatch(change(FORM_ADD_NEW_WALLET, 'blockchain', null))
  dispatch(change(FORM_ADD_NEW_WALLET, 'ethWalletType', null))
}

export const getTransactionsForWallet = (wallet) => async (dispatch, getState) => {
  const tokens = getState().get(DUCK_TOKENS).items()
  dispatch({ type: MULTISIG_UPDATE, wallet: wallet.transactions(wallet.transactions().isFetching(true)) })

  let transactions: TransactionsCollection = wallet.transactions()
  const offset = 0
  const newOffset = offset + TXS_PER_PAGE
  let newTxs = []
  const promises = []
  if (wallet.customTokens()) {
    wallet.customTokens().map((symbol) => {
      const tokenDAO = tokenService.getDAO(symbol)
      if (tokenDAO) {
        promises.push(tokenDAO.getTransfer(wallet.address(), wallet.address()))
      }
    })
  } else {
    for (let token: TokenModel of tokens) {
      if (token.symbol()) {
        const tokenDAO = tokenService.getDAO(token.id())
        if (tokenDAO) {
          promises.push(tokenDAO.getTransfer(wallet.address(), wallet.address()))
        }
      }
    }
  }
  const result = await Promise.all(promises)
  for (let pack of result) {
    newTxs = [...newTxs, ...pack]
  }

  newTxs.sort((a, b) => b.get('time') - a.get('time'))

  for (let tx: TxModel of newTxs) {
    transactions = transactions.add(tx)
  }

  if (transactions.items().length < newOffset) {
    transactions = transactions.endOfList(true)
  }

  dispatch({ type: MULTISIG_UPDATE, wallet: wallet.transactions(transactions.offset(newOffset).isFetching(false).isFetched(true)) })
}
