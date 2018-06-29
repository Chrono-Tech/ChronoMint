import axios from 'axios'

const DEFAULT_BACKEND_HOST = 'https://backend.chronobank.io'

export default class PublicBackendProvider {

  getPublicHost = () => {
    return PUBLIC_BACKEND_REST_URL || DEFAULT_BACKEND_HOST // PUBLIC_BACKEND_REST_URL - global CONST from Webpack
  }

  async get (url) {
    const result = await axios.get(this.getPublicHost() + url)
    return result ? result.data : null
  }
}
