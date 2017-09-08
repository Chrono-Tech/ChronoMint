import { List } from 'immutable'
import { abstractFetchingModel } from './AbstractFetchingModel'
import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

class PollModel extends abstractFetchingModel({
  id: null,
  hash: null,
  owner: null,
  title: '',
  description: '',
  published: new Date(new Date().getTime()),
  voteLimit: null,
  deadline: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)), // +7 days
  options: new List(['Support', 'Decline']),
  files: null, // hash
  active: false,
  status: false,
  isTransaction: false
}) {
  id () {
    return this.get('id')
  }

  hash () {
    return this.get('hash')
  }

  title () {
    return this.get('title')
  }

  description () {
    return this.get('description')
  }

  options () {
    return this.get('options')
  }

  files () {
    return this.get('files')
  }

  active () {
    return this.get('active')
  }

  status () {
    return this.get('status')
  }

  voteLimit () {
    return this.get('voteLimit')
  }

  published () {
    return this.get('published')
  }

  deadline () {
    return this.get('deadline')
  }

  isTransaction () {
    return this.get('isTransaction')
  }

  optionsDescriptions () {
    return this.get('options').map(option => option.description())
  }
}

export const validate = values => {
  const errors = {}
  errors.title = ErrorList.toTranslate(validator.required(values.get('title')))
  return errors
}

export const asyncValidate = (/*values, dispatch*/) => {
}

export default PollModel
