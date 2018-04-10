/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

class VotingProvider {

  url () {
    return '/_voting/'
  }

  async getCounts () {
  }

}

export default new VotingProvider()
