import axios from 'axios'

class VotingProvider {

  url () {
    return '/_voting/'
  }

  async getCounts () {
  }

}

export default new VotingProvider()
