import ErrorList from 'platform/ErrorList'
import * as validator from 'models/validator'

export default function validate (values, props) {
  const voteLimitInTIME = values.get('voteLimitInTIME')
  return {
    title: ErrorList.toTranslate(validator.required(values.get('title'))),
    voteLimitInTIME: new ErrorList()
      .add(validator.required(voteLimitInTIME))
      .add(validator.lowerThan(voteLimitInTIME || 0, props.maxVoteLimitInTIME, false))
      .getErrors(),
    files: ErrorList.toTranslate(validator.validIpfsFileList(values.get('files'))),
  }
}
