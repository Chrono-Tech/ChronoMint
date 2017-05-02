import { abstractModel } from './AbstractModel'

class PollOptionModel extends abstractModel({
  index: null,
  description: '',
  votes: 0
}) {
  index () {
    return this.get('index')
  }

  description () {
    return this.get('description')
  }

  votes () {
    return this.get('votes')
  }
}

export default PollOptionModel
