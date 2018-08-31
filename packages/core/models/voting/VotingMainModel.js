/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import Immutable from 'immutable'

import { abstractFetchingModel } from '../AbstractFetchingModel'
import VotingCollection from './VotingCollection'

export default class VotingMainModel extends abstractFetchingModel({
  voteLimitInTIME: null,
  voteLimitInPercent: null,
  list: new VotingCollection(),
  lastPoll: new BigNumber(0),
}) {
  list (value) {
    return this._getSet('list', value)
  }

  voteLimitInTIME (value) {
    return this._getSet('voteLimitInTIME', value)
  }

  voteLimitInPercent (value) {
    return this._getSet('voteLimitInPercent', value)
  }

  lastPoll (value) {
    return this._getSet('lastPoll', value)
  }
}
