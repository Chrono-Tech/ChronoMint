import { abstractModel } from './AbstractModel'
import validator from '../components/forms/validator'
import ErrorList from '../components/forms/ErrorList'

class TokenStoryFilterModel extends abstractModel({
  hash: null,
  from: null,
  to: null,
  action: null
}) {

  static getAllowActions(): Array<string> {
    return [
      'Issue',
      'Transfer',
      'Approve'
    ]
  }
}

export const validate = values => {
  const errors = {}

  // TODO errors.action in actionOptions

  return errors
}

export default TokenStoryFilterModel
