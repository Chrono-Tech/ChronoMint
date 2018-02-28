import { createSelector } from 'reselect'
import { getCurrentWallet } from './actions'

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
