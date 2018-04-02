import { createSelector } from 'reselect'
import { DUCK_MAIN_WALLET } from './actions'

export const getTxsFromDuck = (state) => {
  const wallet = state.get(DUCK_MAIN_WALLET)
  return wallet.transactions()
}

export const getTxs = () => createSelector(
  [ getTxsFromDuck ],
  (txs) => {
    return txs
  },
)
