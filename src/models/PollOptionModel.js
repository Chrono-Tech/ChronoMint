import {Record as record} from 'immutable'
import {hex2ascii} from '../utils/bytes32'

class PollOptionModel extends record({
  index: null,
  description: '',
  votes: 0
}) {
  index () {
    return this.get('index')
  }

  description () {
    return hex2ascii(this.get('description'))
  }

  votes () {
    return this.get('votes')
  }
}

export default PollOptionModel
