import Immutable from 'immutable'
import { abstractFetchingModel } from './AbstractFetchingModel'
import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

class PollModel extends abstractFetchingModel({
  hash: null,
  owner: null,
  title: '',
  description: '',
  published: null,
  voteLimitInTIME: null,
  deadline: null,
  options: new Immutable.List(['Support', 'Decline']),
  files: null, // hash
  active: false,
  status: false,
  isTransaction: false
}) {

  constructor (data = {}) {
    super({
      ...data,
      published: data.published || new Date(new Date().getTime()),
      deadline: data.deadline || new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)), // +7 days
    })
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

  voteLimitInTIME () {
    return this.get('voteLimitInTIME')
  }

  published () {
    return this.get('published')
  }

  deadline () {
    return this.get('deadline')
  }

  txSummary () {
    return {
      title: this.title(),
      description: this.description(),
      options: this.options().toArray(),
      voteLimit: this.voteLimitInTIME(),
      finishedDate: this.deadline(),
    }
  }
}

export const validate = values => {
  const errors = {}
  errors.title = ErrorList.toTranslate(validator.required(values.get('title')))
  errors.files = ErrorList.toTranslate(validator.validIpfsFileList(values.get('files')))
  return errors
}

export const asyncValidate = (/*values, dispatch*/) => {
}

export default PollModel
