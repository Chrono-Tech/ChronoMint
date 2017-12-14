import TimeHolderModel from 'models/timeHolder/TimeHolderModel'
import * as a from './actions'

const initialState = new TimeHolderModel()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.TIME_HOLDER_INIT:
      return state.isInited(true)
    case a.TIME_HOLDER_TIME_ADDRESS:
      return state.timeAddress(action.address)
    case a.TIME_HOLDER_ADDRESS:
      return state.timeHolderAddress(action.address)
    case a.TIME_HOLDER_WALLET_ADDRESS:
      return state.timeHolderWalletAddress(action.address)
    default:
      return state
  }
}
