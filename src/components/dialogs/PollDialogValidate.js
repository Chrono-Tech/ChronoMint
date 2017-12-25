import * as validator from 'models/validator'
import ErrorList from 'platform/ErrorList'

export default (values) => {
  const errors = {}
  errors.title = ErrorList.toTranslate(validator.required(values.get('title')))

  return errors
}
