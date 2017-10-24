import { selectMultisigWallet } from 'redux/multisigWallet/actions'

export const WALLET_SWITCH_WALLET = 'WALLET/switch_wallet'

export const initWallet = () => (dispatch) => {
  console.log('--actions#', 1)
}

export const switchWallet = (wallet) => async (dispatch) => {
  console.log('--actions#', wallet.address(), wallet.isMultisig())
  dispatch({type: WALLET_SWITCH_WALLET, wallet})
  if (wallet.isMultisig()) {
    dispatch(selectMultisigWallet(wallet))
  }
}

export const getCurrentWallet = (state) => {
  const {isMultisig, current} = state.get('wallet')

  if (!current) {
    return state.get('mainWallet')
  }

  return isMultisig
    ? state.get('multisigWallet').list().get(current)
    : state.get('mainWallet')
}
