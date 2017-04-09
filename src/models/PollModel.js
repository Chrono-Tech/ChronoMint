import {List, Record as record} from 'immutable'
import {hex2ascii} from '../utils/bytes32'
// import PollOptionModel from './PollOptionModel';

class PollModel extends record({
  index: null,
  pollTitle: '',
  pollDescription: '',
  voteLimit: 35000,
  deadline: new Date().getTime() + (1000 * 60 * 60 * 24 * 7), //  7 days
  options: new List([null, null]),
  files: new List(),
  activated: false,
  ongoing: false,
  isFetching: false,
  isVoting: false,
  isActivating: false
}) {
  index () {
    return this.get('index')
  }

  pollTitle () {
    return hex2ascii(this.get('pollTitle'))
  }

  pollDescription () {
    return hex2ascii(this.get('pollDescription'))
  }

  options () {
    return this.get('options')
  }

  files () {
    return this.get('files')
  }

  activated () {
    return this.get('activated')
  }

  ongoing () {
    return this.get('ongoing')
  }

  voteLimit () {
    return this.get('voteLimit')
  }

  deadline () {
    return this.get('deadline')
  }

  isFetching () {
    return this.get('isFetching')
  }

  isVoting () {
    return this.get('isVoting')
  }

  isActivating () {
    return this.get('isActivating')
  }

  optionsDescriptions () {
    return this.get('options').map(option => option.description())
  }
}

export default PollModel
