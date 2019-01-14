/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as types from './constants'

const initialState = {
  userInfo: {
    isFetching: false,
    isFetchingError: false,
    error: null,
  },
  userProfile: {
    isFetching: false,
    isFetchingError: false,
    error: null,
  },
  userAvatar: {
    isFetching: false,
    isFetchingError: false,
    error: null,
  },
}

const mutations = {

  [types.PROFILE_USER_PROFILE_FETCH]: (state) => ({
    ...state,
    userProfile: {
      isFetching: true,
      isFetchingError: false,
      error: null,
    },
  }),

  [types.PROFILE_USER_PROFILE_FETCH_SUCCESS]: (state) => ({
    ...state,
    userProfile: {
      isFetching: false,
      isFetchingError: false,
      error: null,
    },
  }),

  [types.PROFILE_USER_PROFILE_FETCH_FAILURE]: (state, payload) => ({
    ...state,
    userProfile: {
      isFetching: false,
      isFetchingError: true,
      error: payload,
    },
  }),

  [types.PROFILE_USER_PROFILE_UPDATE]: (state) => ({
    ...state,
    userProfile: {
      isFetching: true,
      isFetchingError: false,
      error: null,
    },
  }),

  [types.PROFILE_USER_PROFILE_UPDATE_SUCCESS]: (state) => ({
    ...state,
    userProfile: {
      isFetching: false,
      isFetchingError: false,
      error: null,
    },
  }),

  [types.PROFILE_USER_PROFILE_UPDATE_FAILURE]: (state, payload) => ({
    ...state,
    userProfile: {
      isFetching: false,
      isFetchingError: true,
      error: payload,
    },
  }),

  [types.PROFILE_USER_INFO_FETCH]: (state) => ({
    ...state,
    userInfo: {
      isFetching: true,
      isFetchingError: false,
      error: null,
    },
  }),

  [types.PROFILE_USER_INFO_FETCH_SUCCESS]: (state) => ({
    ...state,
    userInfo: {
      isFetching: false,
      isFetchingError: false,
      error: null,
    },
  }),

  [types.PROFILE_USER_INFO_FETCH_FAILURE]: (state, payload) => ({
    ...state,
    userInfo: {
      isFetching: false,
      isFetchingError: true,
      error: payload,
    },
  }),

  [types.PROFILE_USER_AVATAR_UPLOAD]: (state) => ({
    ...state,
    userAvatar: {
      isFetching: true,
      isFetchingError: false,
      error: null,
    },
  }),

  [types.PROFILE_USER_AVATAR_UPLOAD_SUCCESS]: (state) => ({
    ...state,
    userAvatar: {
      isFetching: false,
      isFetchingError: false,
      error: null,
    },
  }),

  [types.PROFILE_USER_AVATAR_UPLOAD_FAILURE]: (state, payload) => ({
    ...state,
    userAvatar: {
      isFetching: false,
      isFetchingError: true,
      error: payload,
    },
  }),

  [types.PROFILE_USER_AVATAR_DOWNLOAD]: (state) => ({
    ...state,
    userAvatar: {
      isFetching: true,
      isFetchingError: false,
      error: null,
    },
  }),

  [types.PROFILE_USER_AVATAR_DOWNLOAD_SUCCESS]: (state) => ({
    ...state,
    userAvatar: {
      isFetching: false,
      isFetchingError: false,
      error: null,
    },
  }),

  [types.PROFILE_USER_AVATAR_DOWNLOAD_FAILURE]: (state, payload) => ({
    ...state,
    userAvatar: {
      isFetching: false,
      isFetchingError: true,
      error: payload,
    },
  }),

}

export default (state = initialState, { type, payload }) =>
  (type in mutations)
    ? mutations[type](state, payload)
    : state
