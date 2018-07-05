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
