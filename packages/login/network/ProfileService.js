import EventEmitter from 'events'
import axios from 'axios'

const PROFILE_BACKEND_REST_URL = 'https://backend.profile.tp.ntr1x.com'
const GET_PERSONS_REST = '/api/v1/security/persons/query'
const GET_SIGNATURE_REST = '/api/v1/security/signin/signature'
const PURPOSE_VALUE = 'exchange'

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

  getPurposeData(){
    return {'purpose': PURPOSE_VALUE}
  }

  getSignData(){
    return JSON.stringify({
      body: this.getPurposeData(),
      url: GET_SIGNATURE_REST,
    })
  }

  async getProfile(signature){
    const service = this.getServerProvider()

    const body = this.getPurposeData()

    const { data } = await service.post(GET_SIGNATURE_REST, body, this.withAuthorizaionSignature(signature))

    return data
  }

  async getPersonInfo(addresses = []){
    const service = this.getServerProvider()

    const personInfo = await service.post(GET_PERSONS_REST, addresses)

    return personInfo
  }

}

export default new ProfileService()
