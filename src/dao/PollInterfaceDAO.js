import Immutable from 'immutable'
import { MultiEventsHistoryABI, PollInterfaceABI } from './abi'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'

export const TX_ACTIVATE_POLL = 'activatePoll'
export const TX_VOTE = 'vote'
export const TX_REMOVE_POLL = 'killPoll'
export const TX_END_POLL = 'endPoll'

export default class PollInterfaceDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(PollInterfaceABI, at, MultiEventsHistoryABI)
  }

  getDetails () {
    return this._call('getDetails')
  }

  async getVotesBalances () {
    const [ options, values ] = await this._call('getVotesBalances') // [Array(options), Array(values)]
    let votes = new Immutable.Map()
    options.map((option, i) => {
      if (!values[ i ].isZero()) {
        votes = votes.set(option.toString(), values[ i ])
      }
    })
    return votes
  }

  activatePoll () {
    return this._multisigTx(TX_ACTIVATE_POLL)
  }

  vote (choice) {
    return this._tx(TX_VOTE, [ choice ])
  }

  removePoll () {
    return this._tx(TX_REMOVE_POLL)
  }

  endPoll () {
    return this._multisigTx(TX_END_POLL)
  }

}
