
import axios from 'axios'


export const DUCK_I18N = 'i18n'
export const I18N_LOADED = 'tokens/fetching'


export const loadI18n = () => async (dispatch, getState) => {

  let ru = await axios.get('http://localhost:3001/api/v1/minti18n?language=en')

  dispatch({ type: I18N_LOADED, payload: {list: ru, isInited: true} })
}
