/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'
import * as Utils from './utils'
import { deepSortByKey } from '../../utils/formatter'

const URL_PROFILE_HOST = 'https://backend.profile.tp.ntr1x.com/'
const URL_PROFILE_BASE_PATH = URL_PROFILE_HOST + 'api/v1/'

const URL_PROFILE_USER_INFO = 'security/persons/query'
const URL_PROFILE_SIGNATURE = 'security/signin/signature/chronomint'
const URL_PROFILE_UPDATE_PROFILE = 'security/me/profile/combine/update'

// URLs for avatar
const URL_PROFILE_IMAGE_DOWNLOAD = `media/image/`
const URL_PROFILE_IMAGE_UPLOAD = 'media/image/upload'

const EXCHANGE_PURPOSE_DATA = { purpose: 'middleware' }

export default class ProfileService {
  static service = axios.create({ baseURL: URL_PROFILE_BASE_PATH })

  static requestProfileUserInfo (addresses: string[]) {
    return ProfileService.service.request({
      method: 'POST',
      url: URL_PROFILE_USER_INFO,
      // responseType: 'json',
      data: addresses,
    })
  }

  static requestUserProfileUpdate (profile, token) {
    return ProfileService.service.request({
      method: 'POST',
      url: URL_PROFILE_UPDATE_PROFILE,
      // responseType: 'json',
      headers: Utils.getRequestConfigWithAuthorization(token),
      data: profile,
    })
  }

  static requestUserProfile (signature, addresses) {
    return ProfileService.service.request({
      method: 'POST',
      url: URL_PROFILE_SIGNATURE,
      // responseType: 'json',
      data: {
        ...EXCHANGE_PURPOSE_DATA,
        addresses,
      },
      headers: Utils.getPostConfigWithAuthorizationSignature(signature),
    })
  }

  static requestAvatarDownload (imageID, token) {
    return ProfileService.service.request({
      method: 'GET',
      url: URL_PROFILE_IMAGE_DOWNLOAD + imageID,
      // responseType: 'json',
      headers: Utils.getRequestConfigWithAuthorization(token),
    })
  }

  static requestAvatarUpload (formData, token) {
    const imageHeaderConfig = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }
    const headers = Utils.getRequestConfigWithAuthorization(token, imageHeaderConfig)
    return ProfileService.service.request({
      method: 'POST',
      url: URL_PROFILE_IMAGE_UPLOAD,
      // responseType: 'json',
      data: formData,
      headers,
    })
  }

  static getSignData (addresses) {
    return JSON.stringify(
      deepSortByKey({
        url: URL_PROFILE_SIGNATURE,
        body: {
          ...EXCHANGE_PURPOSE_DATA,
          addresses,
        },
      }),
    )
  }
}
