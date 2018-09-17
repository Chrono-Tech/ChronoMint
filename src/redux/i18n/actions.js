/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { loadTranslations, setLocale } from 'react-redux-i18n'
import { merge } from 'lodash'
import PublicBackendProvider from '@chronobank/login/network/PublicBackendProvider'
import { DUCK_I18N } from './constants'

// eslint-disable-next-line import/prefer-default-export
export const loadI18n = (locale) => async (dispatch, getState) => {
  const publicBackendProvider = new PublicBackendProvider()

  try {
    const translationsData = await publicBackendProvider.get('/api/v1/mintTranslations/')
    const { translations } = getState().get(DUCK_I18N)

    if (translationsData) {
      // filter all empty objects '{}'
      const translationsFiltered = {}
      Object.entries(translationsData)
        .filter((t) => {
          return typeof t[1] === 'object' && Object.keys(t[1]).length
        })
        .map((t) =>
          translationsFiltered[t[0]] = merge({}, translations['en'], t[1])
        )

      // i18nJson is global object getting from ./i18nJson.js file
      dispatch(loadTranslations(merge({}, translations, translationsFiltered, i18nJson)))
    }
    dispatch(setLocale(locale))
    return Promise.resolve('LOCALE restored successfully')
  } catch (error) {
    // TODO: to handle error during loading translations and use default 'en' locale somehow.
    return Promise.reject(error)
  }
}
