import ErrorList from 'components/forms/ErrorList'
import validator from 'components/forms/validator'

export default function validate (values) {
  const errors = {}
  errors.title = ErrorList.toTranslate(validator.required(values.get('title')))
  errors.files = ErrorList.toTranslate(validator.validIpfsFileList(values.get('files')))
  return errors
}
