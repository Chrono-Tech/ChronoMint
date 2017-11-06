import { DUCK_MULTISIG_WALLET, selectMultisigWallet } from 'redux/multisigWallet/actions'
import { DUCK_MAIN_WALLET } from 'redux/mainWallet/actions'

export const DUCK_WALLET = 'wallet'
export const WALLET_SWITCH_WALLET = 'WALLET/switch_wallet'

export const initWallet = () => (dispatch, getState) => {
  dispatch(switchWallet(getState().get(DUCK_MAIN_WALLET)))
}

export const switchWallet = (wallet) => (dispatch) => {
  dispatch({ type: WALLET_SWITCH_WALLET, wallet })
  if (wallet.isMultisig()) {
    dispatch(selectMultisigWallet(wallet))
  }
}

export const getCurrentWallet = (state) => {
  const { isMultisig, current } = state.get(DUCK_WALLET)
  return !isMultisig || !current
    ? state.get(DUCK_MAIN_WALLET)
    : state.get(DUCK_MULTISIG_WALLET).item(current)
}
