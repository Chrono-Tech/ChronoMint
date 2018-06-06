/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import TokenModel from 'models/tokens/TokenModel'
import MultisigWalletCollection from 'models/wallet/MultisigWalletCollection'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import * as a from './actions'
import reducer from './reducer'

const wallet1 = new MultisigWalletModel({
  address: 'a1',
})
const wallet2 = new MultisigWalletModel({
  address: 'a2',
})

describe('Multisig Wallet reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(new MultisigWalletCollection())
  })

  it('should handle MULTISIG_FETCHING', () => {
    expect(reducer(new MultisigWalletCollection(), {
      type: a.MULTISIG_FETCHING,
    })).toMatchSnapshot()
  })

  it('should handle MULTISIG_FETCHED', () => {
    expect(reducer(new MultisigWalletCollection({
      isFetching: true,
    }), {
      type: a.MULTISIG_FETCHED,
      wallets: new Immutable.Map({
        a1: wallet1,
        a2: wallet2,
      }),
    })).toMatchSnapshot()
  })

  it('should handle MULTISIG_UPDATE (add new wallet)', () => {
    expect(reducer(new MultisigWalletCollection({
      list: new Immutable.Map({
        a1: wallet1,
      }),
    }), {
      type: a.MULTISIG_UPDATE,
      wallet: wallet2,
    }))
  })

  it('should handle MULTISIG_UPDATE (update existing wallet)', () => {
    const updatedWallet = new MultisigWalletModel({
      address: 'a1',
      tokens: new Immutable.Map({
        t1: new TokenModel(),
      }),
    })
    expect(reducer(new MultisigWalletCollection({
      list: new Immutable.Map({
        a1: wallet1,
      }),
    }), {
      type: a.MULTISIG_UPDATE,
      wallet: updatedWallet,
    })).toMatchSnapshot()
  })

  it('should handle MULTISIG_SELECT', () => {
    expect(reducer(new MultisigWalletCollection({
      list: new Immutable.Map({
        a1: wallet1,
      }),
    }), {
      type: a.MULTISIG_SELECT,
      wallet: wallet1,
    })).toMatchSnapshot()
  })

  it('should handle MULTISIG_REMOVE', () => {
    expect(reducer(new MultisigWalletCollection({
      list: new Immutable.Map({
        a1: wallet1,
        a2: wallet2,
      }),
    }), {
      type: a.MULTISIG_REMOVE,
      wallet: wallet1,
    })).toMatchSnapshot()
  })
})
