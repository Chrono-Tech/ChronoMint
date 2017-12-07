import ErrorList from 'components/forms/ErrorList'
import * as validator from 'components/forms/validator'

export default function validate (values, props) {
  const voteLimitInTIME = values.get('voteLimitInTIME')
  const deadline = values.get('deadline')
  const options = values.get('options')
  return {
    title: ErrorList.toTranslate(validator.required(values.get('title'))),
    voteLimitInTIME: new ErrorList()
      .add(validator.required(voteLimitInTIME))
      .add(validator.lowerThan(voteLimitInTIME || 0, props.maxVoteLimitInTIME, true))
      .getErrors(),
    deadline: new ErrorList()
      .add(validator.required(deadline))
      .getErrors(),
    files: ErrorList.toTranslate(validator.validIpfsFileList(values.get('files'))),
    options: new ErrorList()
      .add(validator.required(options))
      .add(validator.moreThan(options && options.size, 1, true))
      .getErrors(),
  }
}
