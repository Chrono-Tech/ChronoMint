import { createSelector } from 'reselect'
import AddressModel from 'models/wallet/AddressModel'
import { DUCK_MAIN_WALLET } from './actions'

export const getWallet = (state) => {
  return state.get(DUCK_MAIN_WALLET).addresses()
}

export const getWalletAddress = (blockchain: string) => createSelector(
  [getWallet],
  (addresses) => {
    return blockchain ? addresses.item(blockchain) : new AddressModel()
  },
)
