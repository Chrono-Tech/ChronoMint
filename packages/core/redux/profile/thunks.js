/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

import type { Dispatch } from 'redux'
import * as ProfileActions from './actions'
import ProfileService from './service'
import { DUCK_SESSION } from '../session/constants'

export const getUserInfo = (addresses: string[]) => (dispatch: Dispatch<any>/*, getState*/): Promise<*> => {
  // TODO: kept this part commented for further investigation.
  // Somethimes we need to repeat requests
  // const state = getState()
  // const { userInfo } = state.get(DUCK_PROFILE)
  // if (userInfo.status.isFetching) {
  //   return Promise.resolve('IN_PROGRESS') // it is safe to silently ignore duplicated request
  // }

  if (!Array.isArray(addresses) || !addresses.length) {
    return Promise.reject('Malformed request. "addresses" must be non-empty array')
  }

  dispatch(ProfileActions.profileUserInfoFetch())
  return ProfileService.requestProfileUserInfo(addresses)
    .then((response) => {
      dispatch(ProfileActions.profileUserInfoFetchSuccess())
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(ProfileActions.profileUserInfoFetchFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}

export const getUserProfile = (signature: string, addresses: Array) => (dispatch: Dispatch<any>): Promise<*> => {
  // TODO: kept this part commented for further investigation.
  // Somethimes we need to repeat requests
  // const state = getState()
  // const { userProfile } = state.get(DUCK_PROFILE)
  // if (userProfile.status.isFetching) {
  //   return Promise.resolve('IN_PROGRESS') // it is safe to silently ignore duplicated request
  // }

  dispatch(ProfileActions.profileUserProfileFetch())
  return ProfileService.requestUserProfile(signature, addresses)
    .then((response) => {
      dispatch(ProfileActions.profileUserProfileFetchSuccess())
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(ProfileActions.profileUserProfileFetchFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}

export const updateUserProfile = ({
  avatar = null,
  userName = null,
  email = null,
  company = null,
  website = null,
  phone = null,
}) => (dispatch: Dispatch<any>, getState): Promise<*> => {
  const state = getState()

  // TODO: kept this part commented for further investigation.
  // Somethimes we need to repeat requests
  // const { userProfile } = state.get(DUCK_PROFILE)
  // if (userProfile.status.isFetching) {
  //   return Promise.resolve('IN_PROGRESS') // it is safe to silently ignore duplicated request
  // }

  const { profileSignature } = state.get(DUCK_SESSION)
  const token = profileSignature && profileSignature.token || ''
  const profile = {
    level1: {
      avatar,
      userName,
    },
    level2: {
      company,
      email,
      website,
      phone,
    },
  }

  dispatch(ProfileActions.profileUserProfileUpdate())
  return ProfileService.requestUserProfileUpdate(profile, token)
    .then((response) => {
      dispatch(ProfileActions.profileUserProfileFetchSuccess())
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(ProfileActions.profileUserProfileFetchFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}

export const downloadAvatar = (imageID: string) => (dispatch: Dispatch<any>, getState): Promise<*> => {
  const state = getState()

  // TODO: kept this part commented for further investigation.
  // Somethimes we need to repeat requests
  // const { userAvatar } = state.get(DUCK_PROFILE)
  // if (userAvatar.status.isFetching) {
  //   return Promise.resolve('IN_PROGRESS') // it is safe to silently ignore duplicated request
  // }

  const { profileSignature } = state.get(DUCK_SESSION)
  const token = profileSignature && profileSignature.token || ''

  dispatch(ProfileActions.profileUserAvatarDownload())
  return ProfileService.requestAvatarDownload(imageID, token)
    .then((response) => {
      dispatch(ProfileActions.profileUserAvatarDownloadSuccess())
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(ProfileActions.profileUserAvatarDownloadFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}

export const uploadAvatar = (imageFile: any) => (dispatch: Dispatch<any>, getState): Promise<*> => {
  const state = getState()

  // TODO: kept this part commented for further investigation.
  // Somethimes we need to repeat requests
  // const { userAvatar } = state.get(DUCK_PROFILE)
  // if (userAvatar.status.isFetching) {
  //   return Promise.resolve('IN_PROGRESS') // it is safe to silently ignore duplicated request
  // }

  const { profileSignature } = state.get(DUCK_SESSION)
  const token = profileSignature && profileSignature.token || ''

  const formData = new FormData()
  formData.append('image', imageFile, imageFile.name)

  dispatch(ProfileActions.profileUserAvatarUpload())
  return ProfileService.requestAvatarUpload(formData, token)
    .then((response) => {
      dispatch(ProfileActions.profileUserAvatarUploadSuccess())
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(ProfileActions.profileUserAvatarUploadFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}
