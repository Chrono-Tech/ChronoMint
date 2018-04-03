import { loadTranslations, setLocale, i18nReducer, I18n } from 'platform/i18n'
import PublicBackendProvider from '@chronobank/login/network/PublicBackendProvider'

export const DUCK_I18N = 'i18n'

export const loadI18n = (locale) => async (dispatch, getState) => {
  const publicBackendProvider = new PublicBackendProvider()
  let translations = await publicBackendProvider.get('/api/v1/mintTranslations/')

  if (translations) {
    // filter all empty objects '{}'
    const tanslationsFiltered = {};
    Object.entries(translations).filter((t) => {
      return typeof t[1] === 'object' && Object.keys(t[1]).length
    }).map((t) => tanslationsFiltered[t[0]] = t[1])

    dispatch(loadTranslations(tanslationsFiltered))
  }

  dispatch(setLocale(locale))
}
