import Immutable from 'immutable'
import { abstractFetchingModel } from 'models/AbstractFetchingModel'
import BigNumber from 'bignumber.js'

export default class VotingMainModel extends abstractFetchingModel({
  voteLimitInTIME: null,
  list: new Immutable.Map(),
  pollsCount: new BigNumber(0),
  activePollsCount: new BigNumber(0),
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
