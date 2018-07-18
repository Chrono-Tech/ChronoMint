/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import PropTypes from 'prop-types'
import { abstractFetchingModel } from './AbstractFetchingModel'
import AbstractModel from '../refactor/models/AbstractModel'

/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const schemaFactory = () => ({
  id: PropTypes.string,
  hash: PropTypes.string,
  owner: PropTypes.string,
  title: PropTypes.any,
  description: PropTypes.any,
  published: PropTypes.any,
  voteLimitInTIME: PropTypes.any,
  deadline: PropTypes.any,
  options: PropTypes.any,
  files: PropTypes.any, // hash
  active: PropTypes.any,
  status: PropTypes.any,
  isTransaction: PropTypes.any,
  hasMember: PropTypes.any,
  memberOption: PropTypes.any,
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

// class PollModel extends abstractFetchingModel({
//   id: null,
//   hash: null,
//   owner: null,
//   title: '',
//   description: '',
//   published: null,
//   voteLimitInTIME: null,
//   deadline: null,
//   options: new Immutable.List(['Support', 'Decline']),
//   files: null, // hash
//   active: false,
//   status: false,
//   isTransaction: false,
//   hasMember: false,
//   memberOption: null,
// }) {
//   constructor (data = {}) {
//     super({
//       ...data,
//       published: data.published || new Date(new Date().getTime()),
//       deadline: data.deadline || new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)), // +7 days
//     })
//   }
//
//   id (value) {
//     return this._getSet('id', value)
//   }
//
//   hash () {
//     return this.get('hash')
//   }
//
//   title () {
//     return this.get('title')
//   }
//
//   description () {
//     return this.get('description')
//   }
//
//   options () {
//     return this.get('options')
//   }
//
//   files () {
//     return this.get('files')
//   }
//
//   active (value) {
//     return this._getSet('active', value)
//   }
//
//   status () {
//     return this.get('status')
//   }
//
//   voteLimitInTIME () {
//     return this.get('voteLimitInTIME')
//   }
//
//   published () {
//     return this.get('published')
//   }
//
//   deadline () {
//     return this.get('deadline')
//   }
//
//   hasMember () {
//     return this.get('hasMember')
//   }
//
//   memberOption () {
//     return this.get('memberOption')
//   }
//
//   owner () {
//     return this.get('owner')
//   }
//
//   txSummary () {
//     return {
//       title: this.title(),
//       description: this.description(),
//       options: this.options().toArray(),
//       voteLimit: this.voteLimitInTIME(),
//       finishedDate: this.deadline(),
//     }
//   }
// }

export default PollModel
