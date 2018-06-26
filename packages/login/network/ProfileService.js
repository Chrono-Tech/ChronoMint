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

  getServerProvider(){
    return axios.create({ baseURL: this.getProfileHost() })
  }

  withAuthorization(authorization, config = {})  {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${authorization}`,
      },
    }
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

  async getProfile(signature){
    const service = this.getServerProvider()

    const body = {"purpose":"exchange-session"}

    const headers = {
      Authorization: `Signature ${signature}`,
    }

    const { data } = await service.post('/api/v1/security/signin/signature', body, headers)
    console.log('getProfile', data)
  }

  async getPersonInfo(addresses = []){
    const service = this.getServerProvider()

    // const body = {
    //   purpose: `exchange-session`,
    // }

    const personInfo = await service.post('/api/v1/security/persons/query', addresses)

    return personInfo
  }

}

export default new ProfileService()
