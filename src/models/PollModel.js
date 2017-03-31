import {List, Record as record} from 'immutable'
import {hex2ascii} from '../utils/bytes32'
// import PollOptionModel from './PollOptionModel';

class PollModel extends record({
  index: null,
  pollTitle: '',
  pollDescription: '',
  options: new List([null, null]),
  files: new List(),
  activated: false,
  ongoing: false
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

  optionsDescriptions () {
    return this.get('options').map(option => option.description())
  }
}

export default PollModel
