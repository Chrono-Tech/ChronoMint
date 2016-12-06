/* @flow */
// Import web3 and contracts to interact with Ethereum
import { web3, contracts } from '../../web3/web3Init'

// var myWeb3 = web3
// var myContracts = contracts
// contracts.SimpleStorage.set(6)
// console.log(contracts.SimpleStorage)
// console.log(myWeb3)
// console.log(myContracts)
// debugger
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { web3, contracts }
export default function counterReducer (state: mixed = initialState, action: Action): number {
  return state
}
