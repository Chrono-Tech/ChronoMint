import PropTypes from 'prop-types'
import { filterArrayByIndexMask } from 'src/utils'
import AbstractModel from '../AbstractModel'

const schemaFactory = () => ({
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
})

export default class TagModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  get code () {
    return Math.pow(2, this.index)
  }

  static arrayValueOfMask (mask) {
    return filterArrayByIndexMask(TAGS_LIST, mask)
  }
  
  static writeArrayToMask (array) {
    return array.reduce((mask, element) => (mask | element.code), 0)
  }
}

export const TAGS_LIST = [
  new TagModel({
    index: 0,
    name: 'Tag 1',
  }),
  new TagModel({
    index: 1,
    name: 'Tag 2',
  }),
  new TagModel({
    index: 2,
    name: 'Tag 3',
  }),
  new TagModel({
    index: 3,
    name: 'Tag 4',
  }),
  new TagModel({
    index: 4,
    name: 'Tag 5',
  }),
]

export const TAG_ANY_MASK = Math.pow(2, TAGS_LIST.length + 1) - 1
