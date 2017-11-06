import MainWalletModel from 'models/Wallet/MainWalletModel'
import * as a from './actions'

const initialState = new MainWalletModel()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.WALLET_TOKENS_FETCH:
      return state.isFetching(true)
    case a.WALLET_TOKENS:
      return state
        .tokens(action.tokens)
        .isFetching(false)
        .isFetched(true)
    case a.WALLET_BALANCE:
      return state.tokens(state.tokens().set(
        action.token.id(),
        state.tokens().get(action.token.id()).updateBalance(action.isCredited, action.amount)
      ))
    case a.WALLET_BALANCE_SET:
      return state.tokens(state.tokens().set(
        action.token.id(),
        state.tokens().get(action.token.id()).setBalance(action.amount)
      ))
    case a.WALLET_ALLOWANCE:
      return state.tokens(state.tokens().set(
        action.token.id(),
        state.tokens().get(action.token.id()).setAllowance(action.spender, action.value)
      ))
    case a.WALLET_TIME_DEPOSIT:
      // TODO @dkchv: !!! action.isCredited
      return state.timeDeposit(action.amount)
    case a.WALLET_TIME_ADDRESS:
      return state.timeAddress(action.address)
    case a.WALLET_BTC_ADDRESS:
      return state.btcAddress(action.address)
    case a.WALLET_BCC_ADDRESS:
      return state.bccAddress(action.address)
    case a.WALLET_TRANSACTIONS_FETCH:
      return state.transactions(state.transactions().isFetching(true))
    case a.WALLET_TRANSACTION:
      return state.transactions(state.transactions().list(
        state.transactions().list().set(action.tx.id(), action.tx)
      ))
    case a.WALLET_TRANSACTIONS:
      return state.transactions(state.transactions()
        .isFetching(false)
        .list(state.transactions().list().merge(action.map))
        .endOfList(action.map.size)
      )
    case a.WALLET_IS_TIME_REQUIRED:
      return state.isTIMERequired(action.value)
    default:
      return state
  }
}
