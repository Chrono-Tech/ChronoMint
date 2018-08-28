/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'

class EventsService extends EventEmitter {
  constructor () {
    super(...arguments)
  }
}

export default new EventsService()
