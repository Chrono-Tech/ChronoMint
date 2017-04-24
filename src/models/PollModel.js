import {List, Record as record} from 'immutable'
// import PollOptionModel from './PollOptionModel';

class PollModel extends record({
  index: null,
  pollTitle: '',
  pollDescription: '',
  voteLimit: 35000,
  deadline: new Date().getTime() + (1000 * 60 * 60 * 24 * 7), //  7 days
  options: new List([null, null]),
  files: new List(),
  activated: false,
  ongoing: false,
  isFetching: false,
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

  isFetching () {
    return this.get('isFetching')
  }

  isTransaction () {
    return this.get('isTransaction')
  }

  optionsDescriptions () {
    return this.get('options').map(option => option.description())
  }
}

export default PollModel
