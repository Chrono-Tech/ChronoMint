import Immutable from 'immutable'
import { MultiEventsHistoryABI, PollInterfaceABI } from './abi'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'

export const TX_ACTIVATE_POLL = 'activatePoll'

export default class PollInterfaceDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(PollInterfaceABI, at, MultiEventsHistoryABI)
  }

  async getDetails () {
    const result = await this._call('getDetails')
    // eslint-disable-next-line
    console.log('getDetails', result)
  }

  async getVotesBalances () {
    const [options, values] = await this._call('getVotesBalances') // [Array(options), Array(values)]
    const votes = new Immutable.List()
    options.map((option, i) => !values[i].isZero() && votes.set(option.toString(), values[i]))
    return votes
  }

  activatePoll () {
    return this._multisigTx(TX_ACTIVATE_POLL)
  }

}
