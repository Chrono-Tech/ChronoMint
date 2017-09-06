import { addError, clearErrors} from '../network/actions'
export const SENSITIVE_WALLET_ADD = 'sensitive/WALLET_ADD'
export const SENSITIVE_STORED_WALLETS_LOAD = 'sensitive/STORED_WALLETS_LOAD'
export const SENSITIVE_PINCODE_CHECK = 'sensitive/PINCODE_CHECK'


export const addWallet = (wallet) => async dispatch => {
  dispatch({type: SENSITIVE_WALLET_ADD, wallet})

  await window.WebViewBridge.send(JSON.stringify({
    message: 'wallet',
    payload: wallet
  }))
}

export const loadStoredWallets = (wallets) => ({ type: SENSITIVE_STORED_WALLETS_LOAD, wallets })

/**
 * @param pinCode {string}
 */
export const checkPinCode = (wallet) => async (dispatch) => {
  dispatch(clearErrors())

  if (wallet && wallet.address) {
    dispatch({ type: SENSITIVE_PINCODE_CHECK, wallet })
  } else {
    dispatch(addError('Incorrect pin-code'))
  }
}