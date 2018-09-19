/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { loadTranslations, setLocale } from 'react-redux-i18n'
import { merge } from 'lodash'
import { getTranslations } from '@chronobank/nodes/httpNodes/api/backend_chronobank'
import { DUCK_I18N } from './constants'
import { isEntryNotEmptyObject } from '../../utils/common'

// eslint-disable-next-line import/prefer-default-export
export const loadI18n = (locale) => async (dispatch, getState) => {
  dispatch(setLocale(locale))

  try {
    const { payload: { data: translationsData } = {} } = await dispatch(getTranslations())
    const { translations } = getState().get(DUCK_I18N)

    if (typeof translationsData !== 'object') return

    // filter all empty objects '{}'
    const translationsFiltered = Object.assign(...Object.entries(translationsData)
      .filter(isEntryNotEmptyObject)
      .map(([translationLocale, translation]) => ({
        [translationLocale]: merge({}, translations['en'], translation),
      })),
    )

    // i18nJson is global object getting from ./i18nJson.js file
    dispatch(loadTranslations(merge({}, translations, translationsFiltered, i18nJson)))
  } catch (error) {
    // TODO: to handle error during loading translations and use default 'en' locale somehow.
    throw error
  }
}
