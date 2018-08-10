/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

import * as ProfileActionTypes from './constants'

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
  }
}

// eslint-disable-next-line complexity
export default (state = initialState, action) => {
  switch (action.type) {

    case ProfileActionTypes.PROFILE_USER_PROFILE_FETCH: return {
      ...state,
      userProfile: {
        isFetching: true,
        isFetchingError: false,
        error: null,
      }
    }

    case ProfileActionTypes.PROFILE_USER_PROFILE_FETCH_SUCCESS: return {
      ...state,
      userProfile: {
        isFetching: false,
        isFetchingError: false,
        error: null,
      }
    }

    case ProfileActionTypes.PROFILE_USER_PROFILE_FETCH_FAILURE: return {
      ...state,
      userProfile: {
        isFetching: false,
        isFetchingError: true,
        error: action.payload,
      }
    }

    case ProfileActionTypes.PROFILE_USER_PROFILE_UPDATE: return {
      ...state,
      userProfile: {
        isFetching: true,
        isFetchingError: false,
        error: null,
      }
    }

    case ProfileActionTypes.PROFILE_USER_PROFILE_UPDATE_SUCCESS: return {
      ...state,
      userProfile: {
        isFetching: false,
        isFetchingError: false,
        error: null,
      }
    }

    case ProfileActionTypes.PROFILE_USER_PROFILE_UPDATE_FAILURE: return {
      ...state,
      userProfile: {
        isFetching: false,
        isFetchingError: true,
        error: action.payload,
      }
    }

    case ProfileActionTypes.PROFILE_USER_INFO_FETCH: return {
      ...state,
      userInfo: {
        isFetching: true,
        isFetchingError: false,
        error: null,
      }
    }

    case ProfileActionTypes.PROFILE_USER_INFO_FETCH_SUCCESS: return {
      ...state,
      userInfo: {
        isFetching: false,
        isFetchingError: false,
        error: null,
      }
    }

    case ProfileActionTypes.PROFILE_USER_INFO_FETCH_FAILURE: return {
      ...state,
      userInfo: {
        isFetching: false,
        isFetchingError: true,
        error: action.payload,
      }
    }

    case ProfileActionTypes.PROFILE_USER_AVATAR_UPLOAD: return {
      ...state,
      userAvatar: {
        isFetching: true,
        isFetchingError: false,
        error: null,
      }
    }

    case ProfileActionTypes.PROFILE_USER_AVATAR_UPLOAD_SUCCESS: return {
      ...state,
      userAvatar: {
        isFetching: false,
        isFetchingError: false,
        error: null,
      }
    }

    case ProfileActionTypes.PROFILE_USER_AVATAR_UPLOAD_FAILURE: return {
      ...state,
      userAvatar: {
        isFetching: false,
        isFetchingError: true,
        error: action.payload,
      }
    }

    case ProfileActionTypes.PROFILE_USER_AVATAR_DOWNLOAD: return {
      ...state,
      userAvatar: {
        isFetching: true,
        isFetchingError: false,
        error: null,
      }
    }

    case ProfileActionTypes.PROFILE_USER_AVATAR_DOWNLOAD_SUCCESS: return {
      ...state,
      userAvatar: {
        isFetching: false,
        isFetchingError: false,
        error: null,
      }
    }

    case ProfileActionTypes.PROFILE_USER_AVATAR_DOWNLOAD_FAILURE: return {
      ...state,
      userAvatar: {
        isFetching: false,
        isFetchingError: true,
        error: action.payload,
      }
    }

  }

  // ALWAYS return state by default in reducer
  return state
}
