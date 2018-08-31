/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ModelBase from './ModelBase'

export default class FileModel extends ModelBase {
  static DEFAULTS = {
    name: null,
    size: 0,
    type: null,
    content: null,
  }

  static TYPES = {
    JSON: 'application/json',
  }
}
