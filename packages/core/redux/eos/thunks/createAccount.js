/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ProfileService from '../../profile/service'
import EOSAccountService from '../EOSAccountService'
import { getSelectedNetworkId } from '../../persistAccount/selectors'
import { getEosSigner } from '../selectors'
import { executeTransaction } from '../../ethereum/thunks'
import { executeBitcoinTransaction } from '../../bitcoin/thunks'
import { getMainEthWallet } from '../../wallets/selectors/models'

export const createAccount = (payBlockchain = 'eth', accountName = 'chronobank42') => async (dispatch, getState) => {
  const selectedNetworkId = getSelectedNetworkId(getState())
  EOSAccountService.init(selectedNetworkId)
  const { data: userTokenResponse } = await ProfileService.getUserToken()
  const { token: userAuthToken } = userTokenResponse
  const signer = getEosSigner(getState())

  const { data: claimResponse } = await EOSAccountService.createClaim(userAuthToken, {
    blockchain: payBlockchain,
    eosAddress: accountName,
    eosOwnerKey: signer.keys.owner.pub,
    eosActiveKey: signer.keys.active.pub,
  })
  const { claim } = claimResponse
  dispatch(payForAccount(claim))
}

export const payForAccount = (claim) => (dispatch, getState) => {
  const payBlockchains = {
    eth: executeTransaction,
    btc: executeBitcoinTransaction,
  }
  if (payBlockchains[claim.blockchain]) {
    const mainWallet = getMainEthWallet(getState())
    const tx = {
      from: mainWallet.address,
      to: claim.address,
      value: claim.requiredAmount,
      data: '',
    }
    dispatch(payBlockchains[claim.blockchain]({ tx }))
  }
}
