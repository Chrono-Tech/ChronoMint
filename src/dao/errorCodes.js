import errorCodes from '../../node_modules/chronobank-smart-contracts/common/errors'
import { I18n } from 'react-redux-i18n'

const TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND'

export const getErrorKey = (errorCode) => {
  const keys = Object.keys(errorCodes)
  let [key] = keys.filter(item => {
    return errorCodes[item] === errorCode
  })
  if (!key) {
    // ask backend for new code
    // eslint-disable-next-line
    console.warn('errorCode not found for code: ', errorCode)
    key = TOKEN_NOT_FOUND
  }
  return `errorCodes.${key}`
}

export const getErrorCode = (code: number) => {
  return {
    code,
    message: I18n.t(getErrorKey(code))
  }
}

export default errorCodes
