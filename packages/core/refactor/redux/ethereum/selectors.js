import { createSelector } from 'reselect'

export const ethereumSelector = () => (state) => state.ethereum

export const web3Selector = () => createSelector(
  ethereumSelector(),
  (ethereum) => ethereum == null // nil check
    ? null
    : ethereum.web3.value
)

export const pendingSelector = () => createSelector(
  ethereumSelector(),
  (ethereum) => ethereum == null // nil check
    ? null
    : ethereum.pending
)

export const pendingEntrySelector = (address, key) => createSelector(
  pendingSelector(),
  (pending) => {
    if (address in pending) {
      const res = pending[address][key] || null
      if (!res) {
        console.log('res null', address, key, pending, new Error())
      }
      return res
    }
    console.log('res null', address, key, pending, new Error())
    return null
  }
)
