import {List, Record as record} from 'immutable'
import {hex2ascii} from '../utils/bytes32'
// import PollOptionModel from './PollOptionModel';

class PollModel extends record({
  index: null,
  pollTitle: '',
  pollDescription: '',
  options: new List([null, null]),
  files: new List()
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

  optionsDescriptions () {
    return this.get('options').map(option => option.description())
  }
}

export default PollModel
