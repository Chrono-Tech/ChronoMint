/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const DUCK_WALLET = 'wallet'
export const WALLET_SWITCH_WALLET = 'WALLET/switch_wallet'
export const WALLET_SELECT_WALLET = 'WALLET/select_wallet'

export const selectWallet = (blockchain: string, address: string) => (dispatch) => {
  dispatch({ type: WALLET_SELECT_WALLET, blockchain, address })
}
