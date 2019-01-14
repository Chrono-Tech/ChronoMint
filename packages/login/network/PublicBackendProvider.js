/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

const DEFAULT_BACKEND_HOST = 'https://backend.chronobank.io'
const BASE_PATH = '/api/v1'
const SUBSCRIPTIONS_REST = `${BASE_PATH}/subscriptions`

export default class PublicBackendProvider {

  getPublicHost = () => {
    // PUBLIC_BACKEND_REST_URL may appear via WebPack
    // eslint-disable-next-line no-undef
    return PUBLIC_BACKEND_REST_URL || DEFAULT_BACKEND_HOST // PUBLIC_BACKEND_REST_URL - global CONST from Webpack
  }

  async get (url) {
    const result = await axios.get(this.getPublicHost() + url)
    return result ? result.data : null
  }

  getServiceProvider () {
    return axios.create({
      baseURL: this.getPublicHost(),
    })
  }

  async getSubscribe (formData) {
    const service = this.getServiceProvider()

    await service.options(SUBSCRIPTIONS_REST)
    const { data } = await service.post(SUBSCRIPTIONS_REST, formData)

    return data
  }
}
