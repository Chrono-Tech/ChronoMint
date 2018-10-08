/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const requestSubscribeNews = (email) => (dispatch) => {
  const action = {
    type: 'REQ/POST/BACKEND/SUBSCRIBE',
    payload: {
      client: 'backend_chronobank',
      request: {
        method: 'POST',
        url: '/subscriptions',
        data: email,
      },
    },
  }

  return dispatch(action)
    .then((result) => {
      return result
    })
    .catch((error) => {
      throw new Error(error)
    })
}

export const requestWebInterfaceI18nTranslations = () => (dispatch) => {
  const action = {
    type: 'REQ/GET/BACKEND/TRANSLATIONS',
    payload: {
      client: 'backend_chronobank',
      request: {
        method: 'GET',
        url: '/mintTranslations',
      },
    },
  }

  return dispatch(action)
    .then((result) => {
      return result
    })
    .catch((error) => {
      throw new Error(error)
    })
}

