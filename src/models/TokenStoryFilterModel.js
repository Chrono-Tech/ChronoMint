import { abstractModel } from './AbstractModel'
import validator from '../components/forms/validator'
import ErrorList from '../components/forms/ErrorList'

export const TOKEN_STORY_ACTION_ISSUE = 'Issue'
export const TOKEN_STORY_ACTION_TRANSFER = 'Transfer'
export const TOKEN_STORY_ACTION_APPROVE = 'Approve'

class TokenStoryFilterModel extends abstractModel({
  from: null,
  to: null,
  action: null,
  token: null
}) {
  static getAllowActions (): Array<string> {
    return [
      TOKEN_STORY_ACTION_ISSUE,
      TOKEN_STORY_ACTION_TRANSFER,
      TOKEN_STORY_ACTION_APPROVE
    ]
  }
}

export const validate = values => {
  const model = new TokenStoryFilterModel(values)
  const errors = {}

  const fromErrorList = new ErrorList()
  fromErrorList.add(validator.address(model.get('from'), false))
  errors.from = fromErrorList.getErrors()

  const toErrorList = new ErrorList()
  toErrorList.add(validator.address(model.get('to'), false))
  errors.to = toErrorList.getErrors()

  return errors
}

export default TokenStoryFilterModel
