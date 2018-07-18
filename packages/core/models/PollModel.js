/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types'
import AbstractModel from '../refactor/models/AbstractModel'
import Amount from '../../core/models/Amount'

/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const schemaFactory = () => ({
  id: PropTypes.string,
  hash: PropTypes.string,
  owner: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  published: PropTypes.instanceOf(Date),
  voteLimitInTIME: PropTypes.instanceOf(Amount),
  deadline: PropTypes.instanceOf(Date),
  options: PropTypes.any, // Immutable list
  files: PropTypes.string, // hash
  active: PropTypes.bool,
  status: PropTypes.bool,
  isTransaction: PropTypes.bool,
  hasMember: PropTypes.bool,
  memberOption: PropTypes.instanceOf(BigNumber),
})

const defaultProps = {
  id: null,
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
  isTransaction: false,
  hasMember: false,
  memberOption: null,
}

class PollModel extends AbstractModel {
  constructor (ownProps) {
    const props = { ...defaultProps, ...ownProps }
    super({
      ...props,
      published: props.published || new Date(new Date().getTime()),
      deadline: props.deadline || new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)), // +7 days
    }, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  transform () {
    return { ...this }
  }

  txSummary () {
    return {
      title: this.title,
      description: this.description,
      options: this.options.toArray(),
      voteLimit: this.voteLimitInTIME,
      finishedDate: this.deadline,
    }
  }
}

export default PollModel
