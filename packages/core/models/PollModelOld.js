/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { List } from 'immutable'
import { abstractFetchingModel } from './AbstractFetchingModel'

class PollModel extends abstractFetchingModel({
  id: null,
  hash: null,
  owner: null,
  title: '',
  description: '',
  published: null,
  voteLimitInTIME: null,
  deadline: null,
  options: new List(['Support', 'Decline']),
  files: null, // hash
  active: false,
  status: false,
  isTransaction: false,
  hasMember: false,
  memberOption: null,
}) {
  constructor (data = {}) {
    super({
      ...data,
      published: data.published || new Date(new Date().getTime()),
      deadline: data.deadline || new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)), // +7 days
    })
  }

  id (value) {
    return this._getSet('id', value)
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

  active (value) {
    return this._getSet('active', value)
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

  hasMember () {
    return this.get('hasMember')
  }

  memberOption () {
    return this.get('memberOption')
  }

  owner () {
    return this.get('owner')
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

export default PollModel
