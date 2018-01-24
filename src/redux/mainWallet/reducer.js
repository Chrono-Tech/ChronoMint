import MainWalletModel from 'models/wallet/MainWalletModel'
import * as a from './actions'

const initialState = new MainWalletModel()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.WALLET_INIT:
      return state.isInited(action.isInited)
    case a.WALLET_BALANCE:
      return state.balances(state.balances().update(
        state.balances().item(action.token.id()).updateBalance(action.isCredited, action.amount),
      ))
    case a.WALLET_ALLOWANCE:
      return state.allowances(state.allowances().update(action.allowance))
    case a.WALLET_ADDRESS:
      return state.addresses(state.addresses().update(action.address))
    case a.WALLET_TRANSACTIONS_FETCH:
      return state.transactions(state.transactions().isFetching(true))
    case a.WALLET_TRANSACTION:
      return state.transactions(state.transactions().update(action.tx))
    case a.WALLET_TRANSACTIONS:
      return state.transactions(state.transactions()
        .merge(action.map)
        .isFetching(false)
        .endOfList(action.map.size),
      )
    case a.WALLET_IS_TIME_REQUIRED:
      return state.isTIMERequired(action.value)
    case a.WALLET_TOKEN_BALANCE:
      return state.balance(action.balance)
    default:
      return state
  }
}
