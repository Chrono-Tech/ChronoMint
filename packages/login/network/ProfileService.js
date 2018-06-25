import EventEmitter from 'events'
import axios from 'axios'

import {
  NETWORK_ACCOUNTS_SIGNATURES_LOADING,
  NETWORK_ACCOUNTS_SIGNATURES_RESOLVE,
  NETWORK_ACCOUNTS_SIGNATURES_REJECT,
} from '../redux/network/actions'

const PROFILE_BACKEND_REST_URL = 'https://backend.profile.tp.ntr1x.com'

class ProfileService extends EventEmitter {
  connectStore (store) {
    this._store = store
    this._dispatch = store.dispatch
  }

  getProfileHost(){
    return PROFILE_BACKEND_REST_URL
  }

  getProfileService(){
    return axios.create({ baseURL: this.getProfileHost() })
  }

  withAuthorizaionSignature(signature, config = {}) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Signature ${signature}`,
      },
    }
  }

  async getProfileSignature({address}){
    const service = this.getProfileService()
    const dispatch = this._dispatch

    const body = {
      purpose: `${address}`,
    }

    dispatch({ type: NETWORK_ACCOUNTS_SIGNATURES_LOADING })

    return service.post('/api/v1/security/persons/query', body, this.withAuthorizaionSignature())
  }

}

export default new ProfileService()
