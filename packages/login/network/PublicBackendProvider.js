/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

const DEFAULT_BACKEND_HOST = 'https://backend.chronobank.io'

export default class PublicBackendProvider {

  getPublicHost = () => {
    // FIXME: ti use process.env.PUBLIC_BACKEND_REST_URL or rework this part of code
    return PUBLIC_BACKEND_REST_URL || DEFAULT_BACKEND_HOST // PUBLIC_BACKEND_REST_URL - global CONST from Webpack
  }

  async get (url) {
    const result = await axios.get(this.getPublicHost() + url)
    return result ? result.data : null
  }
}
