/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

import {
  createSelector,
} from 'reselect'
import { DUCK_MAIN_WALLET } from 'redux/mainWallet/actions'
import { DUCK_MARKET } from 'redux/market/action'
import { DUCK_TOKENS } from 'redux/tokens/actions'

import { getCurrentWallet } from './actions'

/**
 * SIMPLE SELECTORS
 * ==============================================================================
 */

export const getMainWallet = (state) => {
  return state.get('mainWallet')
}

export const getMainWalletBalance = (symbol) => createSelector(
  [ getMainWallet ],
  (mainWallet) => mainWallet.balances().item(symbol)
)

export const getCurrentWalletBalance = (symbol) => createSelector(
  [ getCurrentWallet ],
  (currentWallet) => currentWallet.balances().item(symbol)
)

export const selectMainWalletBalancesListStore = (state) =>
  state.get(DUCK_MAIN_WALLET).balances().list() // BalancesCollection, array of BalanceModel

export const selectMainWalletTokensStore = (state) =>
  state.get(DUCK_TOKENS) // TokensCollection, array of TokenModel

export const selectMainWalletAddressesListStore = (state) =>
  state.get(DUCK_MAIN_WALLET).addresses().list() // This is an instance of MainWalletModel

export const selectMarketPricesListStore = (state) => state.get(DUCK_MARKET).prices
export const selectMarketPricesSelectedCurrencyStore = (state) => state.get(DUCK_MARKET).selectedCurrency

/**
 * WALLET SECTIONS
 * 
 *  Usage example:
 * 
 * 
 * const getSectionedWallets = makeGetSectionedWallets()
 *   const mapStateToProps = (state, props) => {
 *     const makeMapStateToProps = () => {
 *     return {
 *       walletsSections: getSectionedWallets(state, props),
 *     }
 *   }
 *  return mapStateToProps
 * }
 * 
 * @connect(makeMapStateToProps)
 * export default class AnyComponent extends PureComponent {
 */

/**
 * This is memoized selector. Produce the list of blockchain sections and wallets
 * 
 * @return { [{title: string, data: string | string[]}] }
 *         Returns list of sections for the ReactNative SectionList.
 */
export const getMainWalletSections = createSelector(
  [
    selectMainWalletAddressesListStore,
  ],
  (mainWalletAddressesList) => {
    return mainWalletAddressesList
      .filter( (address) => address.address() !== null ) // We do not need wallets with null address (e.g. BTG in Rinkeby/Infura)
      .reduce( (accumulator, addressModel, blockchainTitle) => {
        const address = addressModel.address() // AddressModel.address() returns string with wallet's address
        accumulator.push({
          // data must contains an array (requirement of SectionList component in React Native, sorry)
          data: [address],
          title: blockchainTitle,
        })
        return accumulator
      }, [] )
      .sort( ({ title: a }, { title: b }) => (a > b) - (a < b) ) // sort by blocakchains titles
  }
)

/**
 * This is the factory for selector
 * It may be used in different components and each of them will have its own memoized copy
 * 
 * @return { [{title: string, data: string | string[]}] }
 *         Returns list of sections for the ReactNative SectionList.
 */
export const makeGetSectionedWallets = () => createSelector(
  [
    getMainWalletSections,
  ],
  (mainWalletSections) => mainWalletSections
)

/**
 * TOKENS AND BALANCE BY ADDRESS
 * 
 * Usage example:
 * const makeMapStateToProps = (origState, origProps) => {
 *  const getWalletTokensAndBalanceByAddress = makeGetWalletTokensAndBalanceByAddress()
 *  const mapStateToProps = (state, ownProps) => {
 *     const walletTokensAndBalance = getWalletTokensAndBalanceByAddress(state, ownProps)
 *     return {
 *       walletTokensAndBalance
 *     }
 *   }
 *   return mapStateToProps
 * }
 * 
 * @connect(makeMapStateToProps)
 * export default class AnyComponent extends PureComponent<WalletPanelProps> {
 * 
 * NOTE: component AnyComnnect MUST have props walletAddress: string & blockchainTitle: string
 * Both props are required, because we may have same wallet addresses in "Bitcoin" and "Bitcoin Cash" blockchains
 */

/**
 * This is the factory for selector
 * It may be used in different components and each of them will have its own memoized copy
 * 
 * @return { { balance: number, tokens: [ {ETH: number } ] } }
 *         Returns list of sections for the ReactNative SectionList.
 */
export const makeGetWalletTokensAndBalanceByAddress = () => {
  return createSelector(
    [
      (state, props) => props,
      selectMainWalletAddressesListStore,
      selectMainWalletBalancesListStore,
      selectMainWalletTokensStore,
      selectMarketPricesListStore,
      selectMarketPricesSelectedCurrencyStore,
    ],
    (
      props,
      mainWalletAddressesList,
      mainWalletBalances,
      mainWalletTokens,
      prices,
      selectedCurrency,
    ) => {

      /**
       * Internal utility
       * @private
       */
      const convertAmountToNumber = (symbol, amount) =>
        mainWalletTokens
          .item(symbol)
          .removeDecimals(amount)
          .toNumber()

      const walletTokensAndBalanceByAddress =  mainWalletBalances // BalancesCollection, array of BalanceModel
        .filter( (balanceItem) => {
          const bSymbol = balanceItem.symbol()
          const bToken = mainWalletTokens.item(bSymbol)
          return bToken.blockchain() === props.blockchainTitle
        })
        .map( (balance) => {
          const bAmount = balance.amount()
          const bSymbol = balance.symbol()
          const tAmount = convertAmountToNumber(bSymbol, bAmount)
          let tokenAmountKeyValuePair = {}
          tokenAmountKeyValuePair[bSymbol] = tAmount
          return {
            symbol: bSymbol,
            amount: tAmount,
          }
        })

      const arrWalletTokensAndBalanceByAddress = [...walletTokensAndBalanceByAddress.values()]
      const result = arrWalletTokensAndBalanceByAddress
        .reduce( (accumulator, tokenKeyValuePair) => {
          const { amount, symbol } = tokenKeyValuePair
          const tokenPrice = prices[ symbol ] && prices[ symbol ][ selectedCurrency ] || null
          if (tokenPrice && amount > 0) {
            accumulator.balance += ( amount * tokenPrice )
          }
          accumulator.tokens.push({ [ symbol ]: amount })
          return accumulator
        }, {
          balance: 0,
          tokens: [],
        })

      return result
    }
  )
}
