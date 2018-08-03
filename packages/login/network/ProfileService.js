/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import axios from 'axios'
import { DUCK_SESSION } from '@chronobank/core/redux/session/actions'

const PROFILE_BACKEND_REST_URL = 'https://backend.profile.tp.ntr1x.com/'
const basePath = '/api/v1'
const GET_PERSONS_REST = `${basePath}/security/persons/query`
const GET_SIGNATURE_REST = `${basePath}/security/signin/signature`
const UPDATE_PROFILE_COMBINE = `${basePath}/security/me/profile/combine/update`

const MEDIA_IMAGE_UPLOAD = `${basePath}/media/image/upload`
const MEDIA_IMAGE_DOWNLOAD = (imageId = '') => `${basePath}/media/image/${imageId}`

const PURPOSE_VALUE = 'exchange'

class ProfileService extends EventEmitter {
  connectStore (store) {
    this._store = store
    this._dispatch = store.dispatch
  }

  getProfileHost () {
    return PROFILE_BACKEND_REST_URL
  }

  getServerProvider () {
    return axios.create({ baseURL: this.getProfileHost() })
  }

  withAuthorization (authorization, config = {}) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${authorization}`,
      },
    }
  }

  withAuthorizaionSignature (signature, config = {}) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Signature ${signature}`,
      },
    }
  }

  getPurposeData () {
    return { 'purpose': PURPOSE_VALUE }
  }

  getSignData () {
    return JSON.stringify({
      body: this.getPurposeData(),
      url: GET_SIGNATURE_REST,
    })
  }

  async getProfile (signature) {
    const service = this.getServerProvider()

    const body = this.getPurposeData()

    const { data } = await service.post(GET_SIGNATURE_REST, body, this.withAuthorizaionSignature(signature))

    return data
  }

  async getPersonInfo (addresses = []) {
    const service = this.getServerProvider()

    const personInfo = await service.post(GET_PERSONS_REST, addresses)

    return personInfo
  }

  async updateUserProfile ({ avatar, userName = null, email = null, company = null, website = null, phone = null }){
    const state = this._store.getState()

    const { profileSignature } = state.get(DUCK_SESSION)
    const token = profileSignature && profileSignature.token || ''

    const service = this.getServerProvider()

    const { data } = await service.post(UPDATE_PROFILE_COMBINE, {
      avatar: avatar || null,
      userName: userName || null,
      company: company || null,
      email: email || null,
      website: website || null,
      phone: phone || null,
    }, this.withAuthorization(token))

    return data
  }

  async avatarUpload (file) {
    const state = this._store.getState()

    const { profileSignature } = state.get(DUCK_SESSION)
    const token = profileSignature && profileSignature.token || ''

    const service = this.getServerProvider()

    const formData = new FormData()
    formData.append('image', file, file.name)

    const { data } = await service.post(
      MEDIA_IMAGE_UPLOAD,
      formData,
      this.withAuthorization(token, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
    )

    return data
  }

  async avatarDownload (imgId) {
    const state = this._store.getState()

    const { profileSignature } = state.get(DUCK_SESSION)
    const token = profileSignature && profileSignature.token || ''

    const service = this.getServerProvider()

    const { data } = await service.get(
      MEDIA_IMAGE_DOWNLOAD(imgId),
      this.withAuthorization(token)
    )

    return data
  }

}

export default new ProfileService()
