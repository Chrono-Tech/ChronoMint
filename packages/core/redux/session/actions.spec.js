/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import { accounts, mockStore } from 'specsInit'
import VotingCollection from '../../models/voting/VotingCollection'
import { DUCK_VOTING } from '../voting/constants'
import { DUCK_TOKENS } from '../tokens/constants'
import TokensCollection from '../../models/tokens/TokensCollection'
import MainWalletModel from '../../models/wallet/MainWalletModel'
import * as a from './actions'

let store

const mainWallet = new MainWalletModel()
// TODO let userProfile: ProfileModel


const duckTokens = new TokensCollection()
const duckVoting = new VotingCollection()

const emptySessionMock = new Immutable.Map({
  market: {
    rates: {},
    lastMarket: {},
  },
  mainWallet,
  [ DUCK_TOKENS ]: duckTokens.isInited(true),
  [ DUCK_VOTING ]: duckVoting.isInited(true),
})

describe('session actions', () => {
  beforeEach(() => {
    // override common cbe session
    store = {}
  })

  it('should create session', () => {
    store = mockStore(emptySessionMock)
    store.dispatch(a.sessionCreate({ account: accounts[ 0 ] }))
    expect(store.getActions()).toMatchSnapshot()
  })

  it('should destroy session', () => {
    store = mockStore(emptySessionMock)
    store.dispatch(a.destroySession())
    expect(store.getActions()).toMatchSnapshot()
  })
})
