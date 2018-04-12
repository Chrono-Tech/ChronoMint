import axios from 'axios'

const DEFAULT_BACKEND_HOST = 'https://backend.chronobank.io'

export default class PublicBackendProvider {

  async get(url) {
    const result = await axios.get(DEFAULT_BACKEND_HOST + url)
    return result ? result.data : null
  }
}
