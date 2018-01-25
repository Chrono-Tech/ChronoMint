import Immutable from 'immutable'
import { abstractFetchingModel } from 'models/AbstractFetchingModel'
import BigNumber from 'bignumber.js'
import VotingCollection from './VotingCollection'

export default class VotingMainModel extends abstractFetchingModel({
  voteLimitInTIME: null,
  list: new VotingCollection(),
  lastPoll: new BigNumber(0),
}) {
  list (value) {
    return this._getSet('list', value)
  }

  voteLimitInTIME (value) {
    return this._getSet('voteLimitInTIME', value)
  }

  lastPoll (value) {
    return this._getSet('lastPoll', value)
  }
}
