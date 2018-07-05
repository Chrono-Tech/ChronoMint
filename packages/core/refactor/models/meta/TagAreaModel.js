import PropTypes from 'prop-types'
import AbstractModel from '../AbstractModel'

const schemaFactory = () => ({
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
})

export default class TagAreaModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  get code () {
    return Math.pow(4, this.index) // odd bit mask
  }

  static valueOf (index) {
    return TAG_AREAS_LIST[index]
  }

  static valueOfCode (code) {
    return TAG_AREAS_LIST[Math.log2(code)/Math.log2(4)]
  }
}

export const TAG_AREAS_LIST = [
  new TagAreaModel({
    index: 0,
    name: 'Tag Area 1',
  }),
  new TagAreaModel({
    index: 1,
    name: 'Tag Area 2',
  }),
  new TagAreaModel({
    index: 2,
    name: 'Tag Area 3',
  }),
  new TagAreaModel({
    index: 3,
    name: 'Tag Area 4',
  }),
  new TagAreaModel({
    index: 4,
    name: 'Tag Area 5',
  }),
]

export const TAG_AREA_ANY_MASK = Math.pow(4, TAG_AREAS_LIST.length) - 1 // cover odd bit mask
