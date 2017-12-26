import Immutable from 'immutable'
import { abstractFetchingModel } from 'models/AbstractFetchingModel'
import BigNumber from 'bignumber.js'
import VotingCollection from './VotingCollection'

export default class VotingMainModel extends abstractFetchingModel({
  voteLimitInTIME: null,
  pollsCount: new BigNumber(0),
  activePollsCount: new BigNumber(0),
  list: new VotingCollection(),
  lastPoll: new BigNumber(0),
}) {
  pollsCount (value) {
    return this._getSet('pollsCount', value)
  }

  list (value) {
    return this._getSet('list', value)
  }

  voteLimitInTIME (value) {
    return this._getSet('voteLimitInTIME', value)
  }

  activePollsCount (value) {
    return this._getSet('activePollsCount', value)
  }

  lastPoll (value) {
    return this._getSet('lastPoll', value)
  }
}
