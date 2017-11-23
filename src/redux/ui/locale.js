import moment from 'moment'
import { setLocale } from 'react-redux-i18n'
import { ls } from 'platform'

export const changeMomentLocale = (locale, dispatch) => {
  moment.locale(locale)
  ls.setLocale(locale)
  dispatch(setLocale(locale))
}
