/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as ProfileActionTypes from './constants'

export const profileUserProfileFetch = () => ({
  type: ProfileActionTypes.PROFILE_USER_PROFILE_FETCH,
})

export const profileUserProfileFetchSuccess = () => ({
  type: ProfileActionTypes.PROFILE_USER_PROFILE_FETCH_SUCCESS,
})

export const profileUserProfileFetchFailure = (payload) => ({
  type: ProfileActionTypes.PROFILE_USER_PROFILE_FETCH_FAILURE,
  payload,
})

export const profileUserProfileUpdate = () => ({
  type: ProfileActionTypes.PROFILE_USER_PROFILE_UPDATE,
})

export const profileUserProfileUpdateSuccess = () => ({
  type: ProfileActionTypes.PROFILE_USER_PROFILE_UPDATE_SUCCESS,
})

export const profileUserProfileUpdateFailure = (payload) => ({
  type: ProfileActionTypes.PROFILE_USER_PROFILE_UPDATE_FAILURE,
  payload,
})

export const profileUserInfoFetch = () => ({
  type: ProfileActionTypes.PROFILE_USER_INFO_FETCH,
})

export const profileUserInfoFetchSuccess = () => ({
  type: ProfileActionTypes.PROFILE_USER_INFO_FETCH_SUCCESS,
})

export const profileUserInfoFetchFailure = (payload) => ({
  type: ProfileActionTypes.PROFILE_USER_INFO_FETCH_FAILURE,
  payload,
})

export const profileUserAvatarUpload = () => ({
  type: ProfileActionTypes.PROFILE_USER_AVATAR_UPLOAD,
})

export const profileUserAvatarUploadSuccess = () => ({
  type: ProfileActionTypes.PROFILE_USER_AVATAR_UPLOAD_SUCCESS,
})

export const profileUserAvatarUploadFailure = (payload) => ({
  type: ProfileActionTypes.PROFILE_USER_AVATAR_UPLOAD_FAILURE,
  payload,
})

export const profileUserAvatarDownload = () => ({
  type: ProfileActionTypes.PROFILE_USER_AVATAR_DOWNLOAD,
})

export const profileUserAvatarDownloadSuccess = () => ({
  type: ProfileActionTypes.PROFILE_USER_AVATAR_DOWNLOAD_SUCCESS,
})

export const profileUserAvatarDownloadFailure = (payload) => ({
  type: ProfileActionTypes.PROFILE_USER_AVATAR_DOWNLOAD_FAILURE,
  payload,
})
