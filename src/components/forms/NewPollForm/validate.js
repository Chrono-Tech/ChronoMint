import validator from '../validator'
import ErrorList from '../ErrorList'

export default (values) => {
  const errors = {}
  const jsValues = values.toJS()

  const pollTitleErrors = new ErrorList()
  pollTitleErrors.add(validator.required(jsValues.pollTitle))
  pollTitleErrors.add(validator.name(jsValues.pollTitle))

  const voteLimitErrors = new ErrorList()
  voteLimitErrors.add(validator.required(jsValues.voteLimit))
  voteLimitErrors.add(validator.lowerThan(jsValues.voteLimit, 35000))

  // TODO @dkchv: refator this with ErrorList and error tokens
  let filledOptionsCount = 0
  if (jsValues.options) {
    const optionsArrayErrors = []

    jsValues.options.forEach((option, optionIndex) => {
      if (option && option.length) {
        filledOptionsCount++
        if (option.length < 3) {
          optionsArrayErrors[optionIndex] = 'Should have length more than or equal 3 symbols'
        }
      }
    })
    if (optionsArrayErrors.length) {
      errors.options = optionsArrayErrors
    }
  }

  if (!jsValues.options || jsValues.options.length < 2 || filledOptionsCount < 2) {
    errors.options = {_error: 'At least two options must be filled'}
  }

  if (filledOptionsCount > 16) {
    errors.options = {_error: 'Allowed no more then 16 filled options'}
  }

  let filledFilesCount = jsValues.files && jsValues.files.filter((hash) => hash && hash.length).length

  if (filledFilesCount > 5) {
    errors.files = {_error: 'Allowed no more then 5 files'}
  }

  return {
    ...errors,
    pollTitle: pollTitleErrors.getErrors(),
    voteLimit: voteLimitErrors.getErrors()
  }
}
