import ErrorList from 'platform/ErrorList'
import validator from 'models/validator'

export default (values) => {
  const errors = {}
  errors.name = ErrorList.toTranslate(validator.name(values.get('name')))
  errors.url = ErrorList.toTranslate(validator.url(values.get('url'), false))
  errors.email = ErrorList.toTranslate(validator.email(values.get('email'), false))
  errors.company = ErrorList.toTranslate(validator.name(values.get('company'), false))
  return errors
}
