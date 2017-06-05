import { abstractModel } from './AbstractModel'
import validator from '../components/forms/validator'
import ErrorList from '../components/forms/ErrorList'

export const TOKENS_STORY_ACTION_ISSUE = 'Issue'
export const TOKENS_STORY_ACTION_TRANSFER = 'Transfer'
export const TOKENS_STORY_ACTION_APPROVE = 'Approve'

class TokensStoryFilterModel extends abstractModel({
  from: null,
  to: null,
  action: null,
  token: null
}) {
  static getAllowedActions (): Array<string> {
    return [
      TOKENS_STORY_ACTION_ISSUE,
      TOKENS_STORY_ACTION_TRANSFER,
      TOKENS_STORY_ACTION_APPROVE
    ]
  }
}

export const validate = values => {
  const model = new TokensStoryFilterModel(values)
  const errors = {}

  const fromErrorList = new ErrorList()
  fromErrorList.add(validator.address(model.get('from'), false))
  errors.from = fromErrorList.getErrors()

  const toErrorList = new ErrorList()
  toErrorList.add(validator.address(model.get('to'), false))
  errors.to = toErrorList.getErrors()

  return errors
}

export default TokensStoryFilterModel
