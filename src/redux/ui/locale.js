import ls from 'utils/LocalStorage'
import { setLocale } from 'react-redux-i18n'
import moment from 'moment'

export const changeMomentLocale = (locale, dispatch) => {
  moment.locale(locale)
  ls.setLocale(locale)
  dispatch(setLocale(locale))
}
