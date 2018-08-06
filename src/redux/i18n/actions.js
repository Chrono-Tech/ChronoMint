/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { loadTranslations, setLocale } from '@chronobank/core-dependencies/i18n'
import { merge } from 'lodash'
import PublicBackendProvider from '@chronobank/login/network/PublicBackendProvider'
import {
  DUCK_I18N,
} from './constants'

// eslint-disable-next-line import/prefer-default-export
export const loadI18n = (locale) => async (dispatch, getState) => {
  const publicBackendProvider = new PublicBackendProvider()
  let translations = await publicBackendProvider.get('/api/v1/mintTranslations/')
  const currentI18n = getState().get(DUCK_I18N)

  if (translations) {
    // filter all empty objects '{}'
    const translationsFiltered = {}
    Object.entries(translations).filter((t) => {
      return typeof t[1] === 'object' && Object.keys(t[1]).length
    }).map((t) => translationsFiltered[t[0]] = t[1])

    // i18nJson is global object getting from ./i18nJson.js file
    dispatch(loadTranslations(merge({}, currentI18n.translations, translationsFiltered, i18nJson)))
  }

  dispatch(setLocale(locale))
}
