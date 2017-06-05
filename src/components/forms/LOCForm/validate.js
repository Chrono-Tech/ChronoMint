import ErrorList from '../ErrorList'
import validator from '../validator'

export default (values, props) => {
  const errors = {}

  const name = values.get('name')
  const nameErrors = new ErrorList()
  nameErrors.add(validator.name(name))
  nameErrors.add(validator.required(name))
  if (name !== props.initialValues.get('name') && props.locs.has(name)) {
    nameErrors.add({
      value: 'errors.alreadyExist',
      what: 'LOC'
    })
  }

  errors.publishedHash = ErrorList.toTranslate(validator.required(values.get('publishedHash')))
  errors.website = ErrorList.toTranslate(validator.url(values.get('website')))
  errors.issueLimit = ErrorList.toTranslate(validator.positiveInt(values.get('issueLimit')))

  return {
    ...errors,
    name: nameErrors.getErrors()
  }
}
