import { List } from 'immutable'
import { abstractFetchingModel } from './AbstractFetchingModel'
import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

class PollModel extends abstractFetchingModel({
  index: null,
  pollTitle: '',
  pollDescription: '',
  voteLimit: null,
  deadline: new Date().getTime() + (1000 * 60 * 60 * 24 * 7), //  7 days
  options: new List([null, null]),
  files: new List(),
  activated: false,
  ongoing: false,
  isTransaction: false
}) {
  index () {
    return this.get('index')
  }

  pollTitle () {
    return this.get('pollTitle')
  }

  pollDescription () {
    return this.get('pollDescription')
  }

  options () {
    return this.get('options')
  }

  files () {
    return this.get('files')
  }

  activated () {
    return this.get('activated')
  }

  ongoing () {
    return this.get('ongoing')
  }

  voteLimit () {
    return this.get('voteLimit')
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

export default PollModel
