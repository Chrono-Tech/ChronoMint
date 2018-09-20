/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { loadTranslations, setLocale } from 'react-redux-i18n'
import { merge } from 'lodash'
import { requestWebInterfaceI18nTranslations } from '@chronobank/nodes/httpNodes/api/backend_chronobank'
import { DUCK_I18N } from './constants'
import { isEntryNotEmptyObject } from '../../utils/common'

// eslint-disable-next-line import/prefer-default-export
export const loadI18n = (locale) => async (dispatch, getState) => {
  try {
    const translationsData = await dispatch(requestWebInterfaceI18nTranslations())
    const { translations } = getState().get(DUCK_I18N)

    if (translationsData) {
      const translationsFiltered = Object.assign(
        ...Object.entries(translationsData)
      .filter(isEntryNotEmptyObject)
      .map(([translationLocale, translation]) => ({
        [translationLocale]: merge({}, translations['en'], translation),
      })),
    )

    // i18nJson is global object getting from ./i18nJson.js file
    dispatch(loadTranslations(merge({}, translations, translationsFiltered, i18nJson)))
    }
    dispatch(setLocale(locale))
    return Promise.resolve('LOCALE restored successfully')
  } catch (error) {
    // TODO: to handle error during loading translations and use default 'en' locale somehow.
    // eslint-disable-next-line no-console
    console.log(error)
    return Promise.reject(error)
  }
}
