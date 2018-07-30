/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import axios from 'axios'
import { store } from '@chronobank/core-dependencies/configureStore'

const PROFILE_BACKEND_REST_URL = 'https://backend.profile.tp.ntr1x.com'
const basePath = '/api/v1'
const GET_PERSONS_REST = `${basePath}/security/persons/query`
const GET_SIGNATURE_REST = `${basePath}/security/signin/signature`
const UPDATE_LEVEL_1 = `${basePath}/security/me/profile/level1`
const UPDATE_LEVEL_2 = `${basePath}/security/me/profile/level2`
const UPDATE_LEVEL_3 = `${basePath}/security/me/profile/level3`
const UPDATE_LEVEL_4 = `${basePath}/security/me/profile/level4`
const CONFIRM_LEVEL_2 = `${basePath}/security/me/profile/level2/confirm`
const VALIDATE_LEVEL_2_PHONE = `${basePath}/security/me/profile/level2/validate/phone`
const VALIDATE_LEVEL_2_EMAIL = `${basePath}/security/me/profile/level2/validate/email`
const PROFILE_NOTIFICATIONS = `${basePath}/security/me/profile/notifications`

const PURPOSE_VALUE = 'exchange'

class ProfileService extends EventEmitter {
  constructor () {
    super()
    this._store = store
    this._dispatch = store.dispatch
  }
  // connectStore (store) {
  //   this._store = store
  //   this._dispatch = store.dispatch
  // }

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

  async updateUserProfile ({ avatar, userName, email }, token){
    const service = this.getServerProvider()

    const { data } = await service.post(UPDATE_LEVEL_1, {
      avatar,
      userName,
      email,
    }, this.withAuthorization(token))

    return data
  }

  // state.token
  async updateLevel1 ({ userName, birthDate, avatar }, token) {
    const service = this.getServerProvider()

    const { data } = await service.post(UPDATE_LEVEL_1, {
      userName,
      birthDate,
      avatar,
    }, this.withAuthorization(token))

    return data
  }

  async updateLevel2 ({ phone, email }, token) {
    const service = this.getServerProvider()

    const { data } = await service.post(UPDATE_LEVEL_2, {
      phone,
      email,
    }, this.withAuthorization(token))

    return data
  }

  async confirmLevel2 ({ phoneCode, emailCode }, token) {
    const service = this.getServerProvider()

    const { data } = await service.post(CONFIRM_LEVEL_2, {
      phoneCode,
      emailCode,
    }, this.withAuthorization(token))

    return data
  }

  async validateLevel2Phone (token) {
    const service = this.getServerProvider()

    const { data } = await service.post(
      VALIDATE_LEVEL_2_PHONE,
      null,
      this.withAuthorization(token),
    )

    return data
  }

  async validateLevel2Email (token) {
    const service = this.getServerProvider()

    const { data } = await service.post(
      VALIDATE_LEVEL_2_EMAIL,
      null,
      this.withAuthorization(token),
    )

    return data
  }

  async updateLevel3 ({ passport, expirationDate, attachments }, token) {
    const service = this.getServerProvider()

    const { data } = await service.post(UPDATE_LEVEL_3, {
      passport,
      expirationDate,
      attachments,
    }, this.withAuthorization(token))

    return data
  }

  async updateLevel4 ({ country, region, city, zip, addressLine1, addressLine2, attachments }, token) {
    const service = this.getServerProvider()

    const { data } = await service.post(UPDATE_LEVEL_4, {
      country,
      state: region,
      city,
      zip,
      addressLine1,
      addressLine2,
      attachments,
    }, this.withAuthorization(token))

    return data
  }

  async toggleNotification ({ domain, type, name, value }, token) {
    const service = this.getServerProvider()

    const { data } = await service.post(PROFILE_NOTIFICATIONS, {
      domain,
      type,
      name,
      value,
    }, this.withAuthorization(token))

    return data
  }

}

export default new ProfileService()
