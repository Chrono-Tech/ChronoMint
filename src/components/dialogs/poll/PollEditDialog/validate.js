import ErrorList from 'components/forms/ErrorList'
import validator from 'components/forms/validator'

export default function validate (values) {
  return {
    title: ErrorList.toTranslate(validator.required(values.get('title'))),
    files: ErrorList.toTranslate(validator.validIpfsFileList(values.get('files'))),
  }
}
