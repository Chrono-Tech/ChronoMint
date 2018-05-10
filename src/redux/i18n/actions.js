import { loadTranslations, setLocale, i18nReducer, I18n } from 'platform/i18n'
import { merge } from 'lodash'
import PublicBackendProvider from '@chronobank/login/network/PublicBackendProvider'

export const DUCK_I18N = 'i18n'

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

    dispatch(loadTranslations(merge({}, currentI18n.translations, translationsFiltered, i18nJson)))
  }

  dispatch(setLocale(locale))
}
